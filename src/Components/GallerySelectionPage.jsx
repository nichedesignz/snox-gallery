import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import tick from '../assets/checkbox2.png';
import '../CSS/gallerystyle.css';
import '../CSS/naveventstyle.css';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';
import CONFIG from '../config';
import ErrorPage from './Errorpage.jsx';
import ImageModal from './common/ImageModal';
import LoadingSpinner from './common/LoadingSpinner';
import GalleryNavigation from './common/GalleryNavigation';
import ImageGrid from './common/ImageGrid';
import useGallery from '../hooks/useGallery';
import GalleryService from '../services/galleryService';
import Footer from './common/Footer';
import '../CSS/footer.css';

const BASE_URL = `${CONFIG.API_BASE_URL}public/api/v1/selection`;

const GallerySelectionPage = () => {
    const [eventDetails, setEventDetails] = useState(null);
    const { event_id } = useParams();
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [selectedOption, setSelectedOption] = useState('allphotos');
    const [maxSelection, setMaxSelection] = useState({});
    const [business, setBusiness] = useState(null);
    const navigate = useNavigate();
    const limit = 50;

    // Use the custom gallery hook
    const {
        loading,
        error,
        images,
        setImages,
        imageLoaded,
        setImageLoaded,
        currentIndex,
        openedImage,
        fetchGalleryImages,
        handleImageClick,
        handleNext,
        handlePrevious,
        closeModal,
        handleDownload,
        setLoading,
        setError
    } = useGallery(BASE_URL, 'authSelToken');

    const handleGalleryClick = async (galleryUuid) => {
        try {
            await fetchGalleryImages(galleryUuid, limit);

            const galleryInfo = galleries.find(g => g.id === galleryUuid);
            if (galleryInfo?.selection_info?.is_locked) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Selection Locked',
                    text: 'This gallery is locked. You cannot make selections.',
                    confirmButtonText: 'OK',
                });
            }

            setSelectedGallery(galleryUuid);
        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
        }
    };

    useEffect(() => {
        const fetchEventData = async () => {
            const token = localStorage.getItem('authSelToken');
           const storedEventId = localStorage.getItem("lastSelUUID");

            if (event_id !== storedEventId) {
                console.warn("Event ID mismatch! ");
                localStorage.removeItem("authSelToken");
                localStorage.setItem("lastSelUUID", event_id);
                navigate("/authpageselection");
                return;
            }
            try {
                const data = await GalleryService.fetchSelectionEventData(event_id, token);
                console.log(data)
                setEventDetails(data.event);
                setGalleries(data.galleries);

                // Set business data if available
                if (data.business) {
                    setBusiness(data.business);
                }

                if (data.galleries.length > 0) {
                    handleGalleryClick(data.galleries[0].id);
                } else {
                    setLoading(false);
                }

                const gallerySelections = data.galleries.reduce((acc, gallery) => {
                    acc[gallery.id] = gallery.selection_info?.max_selections ?? 25;
                    return acc;
                }, {});
                console.log(gallerySelections)
                setMaxSelection(gallerySelections);
            } catch (err) {
                setError("Failed to load galleries.");
                console.error("Error fetching galleries:", err);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [event_id, navigate, setError, setLoading]);

    if (error) return <div><ErrorPage/></div>;

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    const handleToggleSelection = (imageUuid) => {
        const galleryInfo = galleries.find(g => g.id === selectedGallery);

        if (galleryInfo?.selection_info?.is_locked) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Locked',
                text: 'This gallery is locked. You cannot make selections.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const selectedCount = images.filter(img => img.is_selected).length;
        const imageData = images.find(img => img.id === imageUuid);
        const isCurrentlySelected = imageData.is_selected;
        const maxAllowed = maxSelection[selectedGallery] || 25;

        if (!isCurrentlySelected && selectedCount >= maxAllowed) {
            Swal.fire({
                icon: 'info',
                title: 'Selection Limit Reached',
                text: `You can only select up to ${maxAllowed} images.`,
                confirmButtonText: 'OK',
            });
            return;
        }

        setImages(prevImages =>
            prevImages.map(img =>
                img.id === imageUuid
                    ? { ...img, is_selected: !img.is_selected }
                    : img
            )
        );
    };

    const selectedPhotosCount = images.filter(img => img.is_selected).length;

    const handleSend = async () => {
        if (!selectedGallery) return;

        const galleryInfo = galleries.find(g => g.id === selectedGallery);

        if (galleryInfo?.selection_info?.is_locked) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Locked',
                text: 'This gallery is locked. You cannot send images.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const selectedImageIds = images
            .filter(img => img.is_selected)
            .map(img => img.id);

        if (selectedImageIds.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No Selection',
                text: 'No images have been selected.',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const token = localStorage.getItem('authSelToken');

            await GalleryService.submitSelectedImages(selectedGallery, token, selectedImageIds);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Images submitted successfully!',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error("Error submitting images:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to submit images.',
                confirmButtonText: 'OK',
            });
        }
    };

    if (loading) {
        return <LoadingSpinner fullPage={true} />;
    }

    return (
        <div className="maincontainer">
            <div className="navbar">
                <img className="logostyle" src={logo} alt="Logo" />
            </div>

            <div className="galleryContent">
                {eventDetails ? (
                    <h1>{eventDetails.title}</h1>
                ) : (
                    <p>Loading event details...</p>
                )}
            </div>

            <GalleryNavigation
                galleries={galleries}
                selectedGallery={selectedGallery}
                onGalleryClick={handleGalleryClick}
            />

            <div className="segmented-control">
                <button
                    className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
                    onClick={() => handleSelectedOption('allphotos')}
                >
                    All Photos ({images.length})
                </button>
                <button
                    className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
                    onClick={() => handleSelectedOption('selectedphotos')}
                >
                    Selected Photos ({selectedPhotosCount})
                </button>
            </div>

            <ImageGrid
                images={images}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                onImageClick={handleImageClick}
                onToggleSelection={handleToggleSelection}
                showSelection={true}
                selectedOption={selectedOption}
            />

            <ImageModal
                openedImage={openedImage}
                currentIndex={currentIndex}
                images={images}
                onClose={closeModal}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onDownload={handleDownload}
                onToggleSelection={handleToggleSelection}
                showSelection={true}
                tickIcon={tick}
            />

            {selectedPhotosCount > 0 && (
                <div className="senddiv">
                    <button className="floating-button icon-send" onClick={handleSend}>
                        Send ({selectedPhotosCount})
                    </button>
                </div>
            )}

            {/* Footer */}
            <Footer business={business} />
        </div>
    );
};

export default GallerySelectionPage;
