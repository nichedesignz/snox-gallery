import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink } from "react-router";
import logo from "../assets/logo.png";
import "../CSS/photogallery.css";
import download from "../assets/download.png";
import nextArrow from "../assets/next.png";
import previousArrow from "../assets/back.png";

import ErrorPage from "./Errorpage.jsx";
import GalleryService from '../services/galleryService';
import Footer from './common/Footer';
import '../CSS/footer.css';

const LIMIT = 20;

function GalleryViewPage() {
    const { event_id } = useParams();
    const navigate = useNavigate();

    // Core state
    const [images, setImages] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [error, setError] = useState("");

    // Modal state
    const [currentIndex, setCurrentIndex] = useState(null);
    const [openedImage, setOpenedImage] = useState(null);

    // Event/Gallery data
    const [galleryTitle, setGalleryTitle] = useState("");
    const [eventDetails, setEventDetails] = useState(null);
    const [galleries, setGalleries] = useState([]);
    const [business, setBusiness] = useState(null);

    // Pagination state
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [imageClasses, setImageClasses] = useState({});

    // Refs
    const galleryRef = useRef(null);
    const observer = useRef(null);

    // Scroll to gallery section
    const scrollToGallery = () => {
        galleryRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Intersection observer for infinite scroll
    const lastImageRef = useCallback((node) => {
        if (loadingGallery || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setOffset(prevOffset => prevOffset + LIMIT);
            }
        }, { threshold: 0.1 });

        if (node) observer.current.observe(node);
    }, [loadingGallery, hasMore]);

    // Fetch event data and initial gallery using API service
    useEffect(() => {
        const fetchEventData = async () => {
            const token = localStorage.getItem("authToken");
            const storedEventId = localStorage.getItem("lastEventUUID");

            if (event_id !== storedEventId) {
                console.warn("Event ID mismatch!");
                localStorage.removeItem("authToken");
                localStorage.setItem("lastEventUUID", event_id);
                navigate("/");
                return;
            }

            try {
                const data = await GalleryService.fetchEventData(event_id, token);
                setEventDetails(data.event);
                setGalleries(data.galleries);
                setGalleryTitle(data.event.title);

                // Set business data if available
                if (data.business) {
                    setBusiness(data.business);
                }

                // Set first gallery as selected
                if (data.galleries.length > 0) {
                    setSelectedGallery(data.galleries[0].id);
                }
            } catch (err) {
                setError("Failed to load event details.");
                console.error("Error fetching event data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [event_id, navigate]);

    // Fetch gallery images with pagination using API service
    const fetchGalleryImages = useCallback(async (galleryUuid, currentOffset) => {
        try {
            setLoadingGallery(true);
            const token = localStorage.getItem("authToken");
            const newImages = await GalleryService.fetchGalleryImages(
                galleryUuid,
                token,
                currentOffset,
                LIMIT
            );

            if (currentOffset === 0) {
                setImages(newImages);
            } else {
                setImages(prev => [...prev, ...newImages]);
            }

            setHasMore(newImages.length === LIMIT);

            // Close modal when switching galleries
            if (currentOffset === 0) {
                setOpenedImage(null);
                setCurrentIndex(null);
            }

        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
        } finally {
            setLoadingGallery(false);
        }
    }, []);

    // Fetch images when gallery or offset changes
    useEffect(() => {
        if (selectedGallery) {
            fetchGalleryImages(selectedGallery, offset);
        }
    }, [selectedGallery, offset, fetchGalleryImages]);

    // Calculate image orientation classes
    useEffect(() => {
        const loadImageClasses = async () => {
            const newImageClasses = {};
            const promises = images.map(async (image, index) => {
                try {
                    const img = new Image();
                    img.src = image.small.url;
                    await img.decode();

                    newImageClasses[index] = img.naturalWidth > img.naturalHeight ? "horizontal" : "vertical";
                } catch {
                    newImageClasses[index] = "vertical"; // fallback
                }
            });

            await Promise.all(promises);
            setImageClasses(newImageClasses);
        };

        if (images.length > 0) {
            loadImageClasses();
        }
    }, [images]);

    // Gallery selection handler
    const handleGalleryClick = (galleryUuid) => {
        if (galleryUuid !== selectedGallery) {
            setSelectedGallery(galleryUuid);
            setOffset(0);
            setImages([]);
            setImageClasses({});
        }
    };

    // Image modal handlers
    const handleImageClick = (index) => {
        setCurrentIndex(index);
        setOpenedImage(images[index]?.large.url);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        setOpenedImage(images[nextIndex]?.large.url);
    };

    const handlePrevious = () => {
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        setOpenedImage(images[prevIndex]?.large.url);
    };

    const closeModal = () => {
        setCurrentIndex(null);
        setOpenedImage(null);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!openedImage) return;

            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') closeModal();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openedImage, currentIndex, images.length]);

    // Download handler using API service
    const handleDownload = () => {
        if (!openedImage) return;

        const downloadUrl = GalleryService.getDownloadUrl(openedImage);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Image_${currentIndex + 1}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Loading state
    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return <ErrorPage />;
    }

    return (
        <div className="parallax-wrapper">
            {/* Hero Section */}
            <div className="hero parallax-content">
                <div
                    className="imagecontainer"
                    style={{
                        backgroundImage: `url(${eventDetails?.cover_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "85vh",
                        position: "relative",
                    }}
                >
                    <div className="button-container">
                        <button onClick={scrollToGallery}>OPEN GALLERY</button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Title Section */}
                <div className="hero__title">
                    <h1>{galleryTitle}</h1>
                    <div>
                        <img className="logostylePG" src={logo} alt="Logo" />
                    </div>
                </div>

                {/* Gallery Navigation */}
                <div className="navbarmain" ref={galleryRef}>
                    {galleries.length > 0 ? (
                        galleries.map((gallery) => (
                            <NavLink
                                key={gallery.id}
                                className={`nav-item ${selectedGallery === gallery.id ? "selected" : ""}`}
                                onClick={() => handleGalleryClick(gallery.id)}
                            >
                                {gallery.name}
                            </NavLink>
                        ))
                    ) : (
                        <p>No galleries found for this event.</p>
                    )}
                </div>

                {/* Gallery Grid */}
                <div>
                    {loadingGallery && images.length === 0 ? (
                        <div className="loader-wrapper">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <div className="gallery-container">
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <div
                                        key={`${image.id}-${index}`}
                                        className={`gallery-item ${imageClasses[index] || ""}`}
                                        ref={index === images.length - 1 ? lastImageRef : null}
                                    >
                                        <img
                                            src={image.small.url}
                                            alt={`Image ${index + 1}`}
                                            className="img-fluid"
                                            onClick={() => handleImageClick(index)}
                                            style={{ cursor: "pointer" }}
                                            loading="lazy"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No images available for this gallery.</p>
                            )}

                            {/* Loading indicator for pagination */}
                            {loadingGallery && images.length > 0 && (
                                <div className="loader-wrapper">
                                    <div className="loader"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Image Modal */}
                {openedImage && (
                    <div className="openmodal" onClick={closeModal}>
                        <div className="openmodal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="Gdownload-btn" onClick={handleDownload}>
                                <img src={download} alt="Download" />
                            </button>
                            <button className="Gclose-btn" onClick={closeModal}>
                                &times;
                            </button>
                            <button className="Gprev-btn" onClick={handlePrevious}>
                                <img src={previousArrow} alt="Previous" />
                            </button>
                            <img
                                src={openedImage}
                                alt="Full Image"
                                className="openmodal-image"
                                onError={(e) => {
                                    e.target.src = images[currentIndex]?.small.url;
                                }}
                            />
                            <button className="Gnext-btn" onClick={handleNext}>
                                <img src={nextArrow} alt="Next" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer business={business} />
        </div>
    );
}

export default GalleryViewPage;
