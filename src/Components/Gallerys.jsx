import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import download from '../assets/download.png';
import nextArrow from '../assets/next.png';
import previousArrow from '../assets/back.png';
import tick from '../assets/checkbox2.png';
import '../CSS/gallerystyle.css';
import '../CSS/naveventstyle.css';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';
import CONFIG from '../config';
import Errorpage from './Errorpage';
const BASE_URL = `${CONFIG.API_BASE_URL}public/api/v1/selection`;

const Gallery = () => {
    const [eventDetails, setEventDetails] = useState(null);
    const { event_id } = useParams();
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [images, setImages] = useState([]);
    const [openedImage, setOpenedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState({});
    const [selectedOption, setSelectedOption] = useState('allphotos');
    const [maxSelection, setMaxSelection] = useState({});

    const limit = 50;

    useEffect(() => {
        const fetchEventData = async () => {
            const storedEventId = localStorage.getItem("lastSelUUID");

            if (event_id !== storedEventId) {
                console.warn("Event ID mismatch! ");
                localStorage.removeItem("authSelToken");
                localStorage.setItem("lastSelUUID", event_id);
                navigate("/authpageselection");
                return;
            }  
            try {
                const token = localStorage.getItem('authSelToken');
                const response = await axios.get(`${BASE_URL}/${event_id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                if(response.data.result) {
                    const data = response.data.data;
                    console.log(data)
                    setEventDetails(data.event);
                    setGalleries(data.galleries);

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
                }
            } catch (err) {
                setError("Failed to load galleries.");
                console.error("Error fetching galleries:", err);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [event_id]);
    
    if (error) return <div><Errorpage/></div>;

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    const handleGalleryClick = async (galleryUuid) => {
        try {
            const token = localStorage.getItem('authSelToken');
            let allImages = [];
            let currentOffset = 0;
            let totalCount = null;

            do {
                const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { offset: currentOffset, limit },
                });
                console.log(response)
                if (totalCount === null) {
                    totalCount = response.data.data.count;
                }

                allImages = [...allImages, ...response.data.data.results];
                currentOffset += limit;
            } while (currentOffset < totalCount);

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
            setImages(allImages);
            setOpenedImage(null);
            setCurrentIndex(null);
            setLoading(false);
        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader"></div>
            </div>
        );
    }

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

    const handleImage = (index) => {
        setCurrentIndex(index);
        setOpenedImage(images[index]?.large.url);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setOpenedImage(images[(currentIndex + 1) % images.length]?.large.url);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setOpenedImage(
            images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]?.large.url
        );
    };

    const closeModal = () => {
        setCurrentIndex(null);
        setOpenedImage(null);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `${CONFIG.API_BASE_URL}proxy/download/?url=${openedImage}`;
        link.download = `Image_${currentIndex + 1}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
            const payload = { "selected_photos": selectedImageIds };

            await axios.post(`${BASE_URL}/submit/${selectedGallery}/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

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

            <div className="albumnav">
                {galleries.map((gallery) => (
                    <button
                        key={gallery.id}
                        className={`albumnavlink ${selectedGallery === gallery.id ? 'selected' : ""}`}
                        onClick={() => handleGalleryClick(gallery.id)}
                    >
                        {gallery.name}
                    </button>
                ))}
            </div>

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

            {selectedOption === 'allphotos' ? (
                <div className="masonry-container">
                    {images.map((image, index) => (
                        <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
                            <img
                                src={image.small.url}
                                alt={`Image ${index + 1}`}
                                className="img-fluid"
                                onLoad={() =>
                                    setImageLoaded((prev) => ({ ...prev, [image.id]: true }))
                                }
                                style={{
                                    opacity: imageLoaded[image.id] ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out'
                                }}
                                onClick={() => handleImage(index)}
                            />

                            {imageLoaded[image.id] && (
                                <div
                                    className="checkbox-wrapper-18"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        zIndex: 10,
                                    }}
                                >
                                    <div className="round">
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${image.id}`}
                                            checked={image.is_selected || false}
                                            onChange={() => handleToggleSelection(image.id)}
                                        />
                                        <label htmlFor={`checkbox-${image.id}`}></label>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="masonry-container">
                    {images
                        .filter((image) => image.is_selected)
                        .map((image, index) => (
                            <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
                                <img
                                    src={image.small.url}
                                    alt={`Selected Image ${index + 1}`}
                                    className="img-fluid"
                                    onLoad={() =>
                                        setImageLoaded((prev) => ({ ...prev, [image.id]: true }))
                                    }
                                    style={{
                                        opacity: imageLoaded[image.id] ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onClick={() => {
                                        const fullIndex = images.findIndex(img => img.id === image.id);
                                        if (fullIndex !== -1) handleImage(fullIndex);
                                    }}
                                />

                                {imageLoaded[image.id] && (
                                    <div
                                        className="checkbox-wrapper-18"
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            zIndex: 10,
                                        }}
                                    >
                                        <div className="round">
                                            <input
                                                type="checkbox"
                                                id={`selected-checkbox-${image.id}`}
                                                checked={true}
                                                onChange={() => handleToggleSelection(image.id)}
                                            />
                                            <label htmlFor={`selected-checkbox-${image.id}`}></label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    {images.filter((image) => image.is_selected).length === 0 && (
                        <p>No selected photos.</p>
                    )}
                </div>
            )}

            {openedImage && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="download-btn" onClick={handleDownload}>
                            <img src={download} alt="Download" />
                        </button>
                        <button className="close-btn" onClick={closeModal}>
                            &times;
                        </button>
                        <button className="prev-btn" onClick={handlePrevious}>
                            <img src={previousArrow} alt="Previous" />
                        </button>
                        <img src={openedImage} alt="Full view" className="modal-image" />
                        <button className="next-btn" onClick={handleNext}>
                            <img src={nextArrow} alt="Next" />
                        </button>
                        <button
                            className={`selecttick ${images[currentIndex]?.is_selected ? 'selected' : ''}`}
                            onClick={() => images[currentIndex] && handleToggleSelection(images[currentIndex].id)}
                        >
                            <img src={tick} alt="Select" />
                        </button>
                    </div>
                </div>
            )}

            {selectedPhotosCount > 0 && (
                <div className="senddiv">
                    <button className="floating-button icon-send" onClick={handleSend}>
                        Send ({selectedPhotosCount})
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gallery;