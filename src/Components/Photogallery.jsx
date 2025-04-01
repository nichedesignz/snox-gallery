// import React, {useEffect, useState, useRef} from "react";
// import {useParams, useNavigate} from "react-router-dom";
// import {NavLink} from "react-router";
// import axios from "axios";
// import logo from "../assets/logo.png";
// import "../CSS/photogallery.css";
// import download from "../assets/download.png";
// import nextArrow from "../assets/next.png";
// import previousArrow from "../assets/back.png";

// import CONFIG from '../config';

// const BASE_URL = `${CONFIG.API_BASE_URL}public/api/v1/gallery`;

// function Photogallery() {
//     const {event_id} = useParams();
//     const navigate = useNavigate();
//     const [images, setImages] = useState([]);
//     const [selectedGallery, setSelectedGallery] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [openedImage, setOpenedImage] = useState(null);
//     const [galleryTitle, setGalleryTitle] = useState("");
//     const [eventDetails, setEventDetails] = useState(null);
//     const [galleries, setGalleries] = useState([]);
//     const [imageClasses, setImageClasses] = useState({});

//     const [error, setError] = useState("");
//     const [offset, setOffset] = useState(0);

//     const limit = 50;
//     const galleryRef = useRef(null);
//     const [loadingGallery, setLoadingGallery] = useState(false);
//     const scrolltoGallery = () => {
//         galleryRef.current?.scrollIntoView({behavior: "smooth"});
//     };

//     useEffect(() => {
//         const fetchEventData = async () => {
//             setLoading(true);

//             const token = localStorage.getItem("authToken");
//             const storedEventId = localStorage.getItem("lastEventUUID");

//             if (event_id !== storedEventId) {
//                 console.warn("Event ID mismatch! ");
//                 localStorage.removeItem("authToken");
//                 localStorage.setItem("lastEventUUID", event_id);
//                 navigate("/");
//                 return;
//             }

//             try {
//                 const response = await axios.get(`${BASE_URL}/${event_id}`, {
//                     headers: {Authorization: `Bearer ${token}`},
//                 });
//                 let data;
//                 if (response.data.result) {
//                     data = response.data.data;
//                 }

//                 console.log("API Response:", response.data);
//                 console.log("Fetching event details for event_id:", event_id);
//                 console.log("Fetching images for gallery:", galleryUuid);
//                 console.log("Fetching images for gallery:", selectedGallery);
//                 setEventDetails(data.event);
//                 setGalleries(data.galleries);
//                 setGalleryTitle(data.event.title);

//                 if (data.galleries.length > 0) {
//                     const firstGalleryUuid = data.galleries[0].id;
//                     setSelectedGallery(firstGalleryUuid);

//                     const imagesResponse = await axios.get(
//                         `${BASE_URL}/images/${firstGalleryUuid}`,
//                         {headers: {Authorization: `Bearer ${token}`}}
//                     );
//                     setImages(imagesResponse.data.data.results || []);
//                 }
//             } catch (err) {
//                 setError("Failed to load event details.");
//                 console.error("Error fetching event data:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEventData();
//     }, [event_id]);


//     useEffect(() => {
//         if (selectedGallery) {
//             fetchGalleryImages(selectedGallery, offset);
//         }
//     }, [selectedGallery, offset]);

//     useEffect(() => {
//         const loadImages = async () => {
//             const newImageClasses = {};

//             for (const [index, image] of images.entries()) {
//                 const img = new Image();
//                 img.src = image.small.url;
//                 await img.decode(); // Ensure the image is loaded

//                 if (img.naturalWidth > img.naturalHeight) {
//                     newImageClasses[index] = "horizontal";
//                 } else {
//                     newImageClasses[index] = "vertical";
//                 }
//             }

//             setImageClasses(newImageClasses);
//         };

//         if (images.length > 0) {
//             loadImages();
//         }
//     }, [images]);

//     const fetchGalleryImages = async (galleryUuid, newOffset) => {
//         try {
//             setLoadingGallery(true);
//             const token = localStorage.getItem("authToken");
//             let allImages = [];
//             let currentOffset = 0;
//             // const limit = 50;
//             let totalCount = null;

//             do {
//                 const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
//                     headers: {Authorization: `Bearer ${token}`},
//                     params: {offset: currentOffset, limit},
//                 });

//                 if (totalCount === null) {
//                     totalCount = response.data.data.count;
//                     console.log("Total images: " + totalCount);
//                 }

//                 console.log("Fetched images part: " + currentOffset + " to " + (currentOffset + limit));

//                 allImages = [...allImages, ...response.data.data.results];
//                 currentOffset += limit;

//             } while (currentOffset < totalCount);
//             setOffset(newOffset);
//             setImages(allImages);
//             setOpenedImage(null);
//             setCurrentIndex(null);
//             // setOffset(0);

//         } catch (err) {
//             setError("Failed to load gallery images.");
//             console.error("Error fetching gallery images:", err);
//         } finally {
//             setTimeout(() => {
//                 setLoadingGallery(false);
//             }, 500);
//         }
//     };
//     const handleGalleryClick = (galleryUuid) => {
//         setSelectedGallery(galleryUuid);
//         setOffset(0);
//     };


//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index]?.small.url);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length]?.small.url);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
//         setOpenedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]?.small.url);
//     };

//     const closeModal = () => {
//         setCurrentIndex(null);
//         setOpenedImage(null);
//     };


//     const handleDownload = () => {
//         const link = document.createElement('a');
//         link.href = `${CONFIG.API_BASE_URL}proxy/download/?url=${openedImage}`;
//         link.download = `Image_${currentIndex + 1}.jpeg`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//     if (loading) {
//         return (
//             <div className="loader-wrapper">
//                 <div className="loader"></div>
//             </div>
//         );
//     }
//     if (error) return <div>{error}</div>;

//     return (
//         <div className="parallax-wrapper">
//             <div className="hero parallax-content">
//                 <div
//                     className="imagecontainer"
//                     style={{
//                         backgroundImage: `url(${eventDetails.cover_image})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                         backgroundRepeat: "no-repeat",
//                         height: "85vh",
//                         position: "relative",
//                     }}
//                 >
//                     <div className="button-container">
//                         <button onClick={scrolltoGallery}>OPEN GALLERY</button>
//                     </div>
//                 </div>
//             </div>

//             <div className="main-content">
//                 <div className="hero__title">
//                     <h1>{galleryTitle}</h1>
//                     <div>
//                         <img className="logostylePG" src={logo} alt="Logo"/>
//                     </div>
//                 </div>


//                 <div className="navbarmain" ref={galleryRef}>
//                     {galleries.length > 0 ? (
//                         galleries.map((gallery) => (
//                             <div key={gallery.id}>
//                                 <NavLink
//                                     className={`nav-item ${
//                                         selectedGallery === gallery.id ? "selected" : ""
//                                     }`}
//                                     onClick={() => handleGalleryClick(gallery.id)}
//                                 >
//                                     {gallery.name}
//                                 </NavLink>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No galleries found for this event.</p>
//                     )}
//                 </div>


//                 <div>
//                     {loadingGallery ? (
//                         <div className="loader-wrapper">
//                             <div className="loader"></div>
//                         </div>
//                     ) : (
//                         <div className="gallery-container">
//                             {images.length > 0 ? (
//                                 images.map((image, index) => (
//                                     <div key={image.id} className={`gallery-item ${imageClasses[index] || ""}`}>
//                                         <img
//                                             src={image.small.url}
//                                             alt={`Image ${index + 1}`}
//                                             className="img-fluid"
//                                             onClick={() => handleImage(index)}
//                                             style={{cursor: "pointer"}}
//                                         />
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No images available for this gallery.</p>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {openedImage && (
//                     <div className="openmodal" onClick={closeModal}>
//                         <div className="openmodal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="Gdownload-btn" onClick={handleDownload}>
//                                 <img src={download} alt="Download"/>
//                             </button>
//                             <button className="Gclose-btn" onClick={closeModal}>&times;</button>
//                             <button className="Gprev-btn" onClick={handlePrevious}>
//                                 <img src={previousArrow} alt="Previous"/>
//                             </button>
//                             <img src={openedImage} alt="Full Image" className="openmodal-image"/>
//                             <button className="Gnext-btn" onClick={handleNext}>
//                                 <img src={nextArrow} alt="Next"/>
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>

//     );
// }

// export default Photogallery;


import React, {useEffect, useState, useRef,useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {NavLink} from "react-router";
import axios from "axios";
import logo from "../assets/logo.png";
import "../CSS/photogallery.css";
import download from "../assets/download.png";
import nextArrow from "../assets/next.png";
import previousArrow from "../assets/back.png";

import CONFIG from '../config';
import Errorpage from "./Errorpage";

const BASE_URL = `${CONFIG.API_BASE_URL}public/api/v1/gallery`;

function Photogallery() {
    const {event_id} = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [openedImage, setOpenedImage] = useState(null);
    const [galleryTitle, setGalleryTitle] = useState("");
    const [eventDetails, setEventDetails] = useState(null);
    const [galleries, setGalleries] = useState([]);
    const [imageClasses, setImageClasses] = useState({});
    const [hasMore, setHasMore] = useState(true);

    const [error, setError] = useState("");
    const [offset, setOffset] = useState(0);

    const limit = 20;
    const galleryRef = useRef(null);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const scrolltoGallery = () => {
        galleryRef.current?.scrollIntoView({behavior: "smooth"});
    };
    const observer = useRef(null);
    const lastImageRef = useCallback(
      (node) => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setOffset((prevOffset) => prevOffset + limit);
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading, hasMore]
    );
    useEffect(() => {
        const fetchEventData = async () => {
            setLoading(true);

            const token = localStorage.getItem("authToken");
            const storedEventId = localStorage.getItem("lastEventUUID");

            if (event_id !== storedEventId) {
                console.warn("Event ID mismatch! ");
                localStorage.removeItem("authToken");
                localStorage.setItem("lastEventUUID", event_id);
                navigate("/");
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/${event_id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                let data;
                if (response.data.result) {
                    data = response.data.data;
                }

                console.log("API Response:", response.data);
                // console.log("Fetching event details for event_id:", event_id);
                // console.log("Fetching images for gallery:", galleryUuid);
                // console.log("Fetching images for gallery:", selectedGallery);
                setEventDetails(data.event);
                setGalleries(data.galleries);
                setGalleryTitle(data.event.title);

                if (data.galleries.length > 0) {
                    const firstGalleryUuid = data.galleries[0].id;
                    setSelectedGallery(firstGalleryUuid);

                    const imagesResponse = await axios.get(
                        `${BASE_URL}/images/${firstGalleryUuid}`,
                        {headers: {Authorization: `Bearer ${token}`}}
                    );
                    setImages(imagesResponse.data.data.results || []);
                }
            } catch (err) {
                setError("Failed to load event details.");
                console.error("Error fetching event data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEventData();
    }, [event_id]);


    useEffect(() => {
        if (selectedGallery) {
            fetchGalleryImages(selectedGallery, offset);
            setHasMore(true);
        }

    }, [selectedGallery, offset]);

    useEffect(() => {
        const loadImages = async () => {
            const newImageClasses = {};

            for (const [index, image] of images.entries()) {
                const img = new Image();
                img.src = image.small.url;
                await img.decode(); // Ensure the image is loaded

                if (img.naturalWidth > img.naturalHeight) {
                    newImageClasses[index] = "horizontal";
                } else {
                    newImageClasses[index] = "vertical";
                }
            }

            setImageClasses(newImageClasses);
        };

        if (images.length > 0) {
            loadImages();
        }
    }, [images]);

    const fetchGalleryImages = async (galleryUuid, newOffset) => {
        try {
            setLoadingGallery(true);
            const token = localStorage.getItem("authToken");
            let allImages = [];
            let currentOffset = 0;
            // const limit = 50;
            let totalCount = null;

            do {
                const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
                    headers: {Authorization: `Bearer ${token}`},
                    params: {offset: currentOffset, limit},
                });

                if (totalCount === null) {
                    totalCount = response.data.data.count;
                    console.log("Total images: " + totalCount);
                }

                console.log("Fetched images part: " + currentOffset + " to " + (currentOffset + limit));

                allImages = [...allImages, ...response.data.data.results];
                currentOffset += limit;

            } while (currentOffset < totalCount);
            setOffset(newOffset);
            setImages(allImages);
            // setHasMore(response.data.results.length === limit);
            setHasMore(response.data.data.results.length === limit);

            setOpenedImage(null);
            setCurrentIndex(null);
            // setOffset(0);

        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
        } finally {
            setTimeout(() => {
                setLoadingGallery(false);
            }, 500);
        }
    };
    const handleGalleryClick = (galleryUuid) => {
        setSelectedGallery(galleryUuid);
        setOffset(0);
    };


    const handleImage = (index) => {
        setCurrentIndex(index);
        setOpenedImage(images[index]?.small.url);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setOpenedImage(images[(currentIndex + 1) % images.length]?.small.url);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
        setOpenedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]?.small.url);
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
    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader"></div>
            </div>
        );
    }
    if (error) return <div><Errorpage/></div>;

    return (
        <div className="parallax-wrapper">
            <div className="hero parallax-content">
                <div
                    className="imagecontainer"
                    style={{
                        backgroundImage: `url(${eventDetails.cover_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "85vh",
                        position: "relative",
                    }}
                >
                    <div className="button-container">
                        <button onClick={scrolltoGallery}>OPEN GALLERY</button>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="hero__title">
                    <h1>{galleryTitle}</h1>
                    <div>
                        <img className="logostylePG" src={logo} alt="Logo"/>
                    </div>
                </div>


                <div className="navbarmain" ref={galleryRef}>
                    {galleries.length > 0 ? (
                        galleries.map((gallery) => (
                            <div key={gallery.id}>
                                <NavLink
                                    className={`nav-item ${
                                        selectedGallery === gallery.id ? "selected" : ""
                                    }`}
                                    onClick={() => handleGalleryClick(gallery.id)}
                                >
                                    {gallery.name}
                                </NavLink>
                            </div>
                        ))
                    ) : (
                        <p>No galleries found for this event.</p>
                    )}
                </div>


                <div>
                    {loadingGallery ? (
                        <div className="loader-wrapper">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <div className="gallery-container">
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <div key={image.id} 
                                    className={`gallery-item ${imageClasses[index] || ""}`}
                                    ref={index === images.length - 1 ? lastImageRef : null}
>
                                        <img
                                            src={image.small.url}
                                            alt={`Image ${index + 1}`}
                                            className="img-fluid"
                                            onClick={() => handleImage(index)}
                                            style={{cursor: "pointer"}}
                                              loading="lazy"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No images available for this gallery.</p>
                            )}
                        </div>
                    )}
                </div>

                {openedImage && (
                    <div className="openmodal" onClick={closeModal}>
                        <div className="openmodal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="Gdownload-btn" onClick={handleDownload}>
                                <img src={download} alt="Download"/>
                            </button>
                            <button className="Gclose-btn" onClick={closeModal}>&times;</button>
                            <button className="Gprev-btn" onClick={handlePrevious}>
                                <img src={previousArrow} alt="Previous"/>
                            </button>
                            <img src={openedImage} alt="Full Image" className="openmodal-image"/>
                            <button className="Gnext-btn" onClick={handleNext}>
                                <img src={nextArrow} alt="Next"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Photogallery;


