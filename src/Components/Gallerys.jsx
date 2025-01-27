
// import React, { useState ,useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import 'bs5-lightbox';
// import Swal from 'sweetalert2'
// import '../CSS/gallerystyle.css';
// import nextArrow from '../assets/next.png';
// import previousArrow from '../assets/back.png';
// import logo from '../assets/logo.png';
// import tick from '../assets/checkbox2.png';
// import download from '../assets/download.png'
// import SelectedPhotos from '../Components/SelectedPhotos.jsx'

// import Navigationevents from './Navigationevents.jsx';
// function Gallery() {
//     const [images, setImages] = useState([]);
   
// const [loading,setLoading]=useState(true)
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [selected, setSelected] = useState({});
//     const [openedImage, setOpenedImage] = useState(null);
//     const [selectedOption, setSelectedOption] = useState("allphotos");
//     // const [errormessage, setErrormessage] = useState("")
//     const [imageLoaded, setImageLoaded] = useState({});

//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 const response = await fetch('/imageData.json');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch image data');
//                 }
//                 const data = await response.json();
//                 setImages(data);
//             } catch (error) {
//                 console.error("Error fetching image data:", error);
//             } finally {
//                 setLoading(false); 
//             }
//         };

//         fetchImages();
//     }, []);
//     const handleSelection = (option) => {
//         setSelectedOption(option);
//     };
 
//     const handleselected = (index) => {
//         const selectedphotosCount = Object.values(selected).filter((isSelected) => isSelected).length;
//         if (selectedphotosCount >= 10 && !selected[index]) {
//             // setErrormessage("you can select maximum of 10 photos !")
//             Swal.fire({
//                 icon: "info",
//                 title: "Limit reached...",
//                 text: "you can only select upto 10 photos !",
//               });
//             return;
//         }
//         // setErrormessage('')
//         setSelected((prevSelected) => ({
//             ...prevSelected,
//             [index]: !prevSelected[index],
//         })
//         );
//     };

//     const selectedImages = images.filter((image) =>
//         selected[image.id]
//     )


//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index].src);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length].src);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//         setOpenedImage(images[(currentIndex === 0 ? images.length - 1 : currentIndex - 1)].src);
//     };

//     const closeModal = () => {
//         setCurrentIndex(null);
//         setOpenedImage(null);
//     };
//     const handleDownload=()=>
//     {
//         const link = document.createElement('a');
//         link.href = openedImage;
//         link.download = `Image_${currentIndex + 1}.jpg`; 
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
   
//     const selectedphotosCount = Object.values(selected).filter((isSelected) => isSelected).length;
//     return (
//         <div className="maincontainer">
//             <div className="navbar">
//                 <img className="logostyle" src={logo} alt="" />
//             </div>
//             <div className="galleryContent">
//                 <h1>Steffy & Nobin</h1>
//                 <h3>Wedding Album</h3>
//             </div>
//             <Navigationevents/>
//             <div className="segmented-control">
//                 <button
//                     className={`segment ${selectedOption === "allphotos" ? "active" : ""}`}
//                     onClick={() => handleSelection("allphotos")}
//                 >
//                     All Photos({images.length})
//                 </button>
//                 <button
//                     className={`segment ${selectedOption === "selectedphotos" ? "active" : ""}`}
//                     onClick={() => handleSelection("selectedphotos")}
//                 >
//                     Selected Photos  ({selectedphotosCount})
//                 </button>

//             </div>
          
            
//             {loading ? (
   
//     <div className="loading">Loading images...</div>
// ) : selectedOption === "allphotos" ? (
   
//     <div>
//         <div className="masonry-container">
//             {images.map((image, index) => (
//                 <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
//                     {/* <img
                    
//                         src={image.src}
//                         alt={image.alt}
//                         className="img-fluid"
//                         onLoad={(e) => e.target.style.opacity = 1}
//         style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
//                         onClick={() => handleImage(index)}
//                     /> */}


//                   {/* lazy loading  */}
//                     <img
//                         src={image.src}
//                         alt={image.alt}
//                         className="img-fluid"
//                         onLoad={() =>
//                             setImageLoaded((prev) => ({ ...prev, [image.id]: true }))
//                         }
//                         style={{ opacity: imageLoaded[image.id] ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
//                         onClick={() => handleImage(index)}
//                     />
// {imageLoaded[image.id] && (
//                     <div
//                         className="checkbox-wrapper-18"
//                         style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             zIndex: 10,
//                         }}
//                     >
//                         <div className="round">
//                             <input
//                                 type="checkbox"
//                                 id={`checkbox-${image.id}`}
//                                 checked={selected[image.id] || false}
//                                 onChange={() => handleselected(image.id)}
//                             />
//                             <label htmlFor={`checkbox-${image.id}`}></label>
//                         </div>
//                     </div>
// )}
//                 </div>
//             ))}
//         </div>
//     </div>
// ) : (
//     <SelectedPhotos images={selectedImages} handleselected={handleselected} />
// )}

//             {openedImage && (
//                 <div className="modal" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                     <button className="download-btn" onClick={handleDownload} >
//                <img src={download} alt="" />
//                         </button>
//                         <button className="close-btn" onClick={closeModal}>
//                             &times;
//                         </button>
//                         <button className="prev-btn" onClick={handlePrevious}>
//                             <img src={previousArrow} alt="Previous" />
//                         </button>

//                         <img src={openedImage} alt="Full Image" className="modal-image" />

//                         <button className="next-btn" onClick={handleNext}>
//                             <img src={nextArrow} alt="Next" />
//                         </button>

//                         <button
//                             className={`selecttick ${selected[images[currentIndex]?.id] ? 'selected' : ''}`}
//                             onClick={() => handleselected(images[currentIndex]?.id)}
//                         >
//                             <img src={tick} alt="Select" />
//                         </button> 
//                           {/* {errormessage && (
//                             <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
//                                 {errormessage}
//                             </div>
//                         )} */}

//                     </div>
                    
//                 </div>

//             )}

// {!openedImage && selectedphotosCount > 0 && (
//   <div className="senddiv">
//     <button
//       className="floating-button icon-send"
//       onClick={() => console.log("Images sent!", selectedImages)}
//     >
//       Send
    
//     </button>
//   </div>
// )}


//         </div>
//     );
// }


// export default Gallery;


                     
// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bs5-lightbox';
// import Swal from 'sweetalert2';
// import '../CSS/gallerystyle.css';
// import nextArrow from '../assets/next.png';
// import previousArrow from '../assets/back.png';
// import logo from '../assets/logo.png';
// import tick from '../assets/checkbox2.png';
// import download from '../assets/download.png';
// import SelectedPhotos from '../Components/SelectedPhotos.jsx';
// import { NavLink, useNavigate } from 'react-router-dom';
// import '../CSS/naveventstyle.css';
// import Navigationevents from './Navigationevents.jsx';

// const BASE_URL = 'https://web.snoxpro.com/public/api/v1/gallery';

// function Gallery() {
//     const { event_uuid } = useParams();

//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [selected, setSelected] = useState({});
//     const [openedImage, setOpenedImage] = useState(null);
//     const [selectedOption, setSelectedOption] = useState('allphotos');
//     const [imageLoaded, setImageLoaded] = useState({});
//     const [galleryTitle, setGalleryTitle] = useState('Gallery');
   
//     const [selectedGallery, setSelectedGallery] = useState(GALLERY_IDS.Haldi);

//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             navigate('/');
//         } else {
//             fetchImages(selectedGallery);
//         }
//     }, [selectedGallery, navigate]);

//     const fetchImages = async (galleryId) => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${BASE_URL}/${galleryId}`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const data = await response.json();
//             setGalleryTitle(data.event?.title || 'Gallery');

//             if (data && Array.isArray(data.galleries)) {
//                 const fetchedImages = data.galleries.map((gallery) => ({
//                     id: gallery.uuid,
//                     image_url: gallery.image,
//                 }));
//                 setImages(
//                     fetchedImages.map((image) => ({
//                         ...image,
//                         src: image.image_url,
//                     }))
//                 );
//             } else {
//                 console.error('Unexpected data structure:', data);
//                 setImages([]);
//             }
//         } catch (error) {
//             console.error('Error fetching image data:', error);
//             setImages([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSendSelectedPhotos = async () => {
//         const selectedImagesData = images
//             .filter((image) => selected[image.id])
//             .map((image) => ({
//                 image_uuid: image.id,
//                 is_selected: true,
//             }));

//         const token = localStorage.getItem('authToken');
//         const event_uuid = selectedGallery;

//         try {
//             const response = await fetch(`${BASE_URL}//public/api/v1/selection/submit/${event_uuid}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     event_uuid,
//                     selected_images: selectedImagesData,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to send selected photos');
//             }

//             const result = await response.json();
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Photos sent successfully!',
//                 text: result.message || 'Your selected photos have been successfully sent.',
//             });
//         } catch (error) {
//             console.error('Error sending selected photos:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error sending photos',
//                 text: 'There was an issue sending the selected photos. Please try again later.',
//             });
//         }
//     };

//     const handleselected = (index) => {
//         const selectedPhotosCount = Object.values(selected).filter((isSelected) => isSelected).length;
//         if (selectedPhotosCount >= 10 && !selected[index]) {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Limit reached...',
//                 text: 'You can only select up to 10 photos!',
//             });
//             return;
//         }

//         const updatedSelected = {
//             ...selected,
//             [index]: !selected[index],
//         };
//         setSelected(updatedSelected);
//     };

//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index].src);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length].src);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//         setOpenedImage(images[(currentIndex === 0 ? images.length - 1 : currentIndex - 1)].src);
//     };

//     const closeModal = () => {
//         setCurrentIndex(null);
//         setOpenedImage(null);
//     };

//     const handleDownload = () => {
//         const link = document.createElement('a');
//         link.href = openedImage;
//         link.download = `Image_${currentIndex + 1}.jpg`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const selectedPhotosCount = Object.values(selected).filter((isSelected) => isSelected).length;

//     return (
//         <div className="maincontainer">
//             <div className="navbar">
//                 <img className="logostyle" src={logo} alt="" />
//             </div>
//             <div className="galleryContent">
//                 <h1>{galleryTitle}</h1>
//                 <h3>Wedding Album</h3>
//             </div>
//             <div className="albumnav">
//                 <NavLink to="#" className="albumnavlink" onClick={() => setSelectedGallery(GALLERY_IDS.Haldi)}>
//                     Haldi
//                 </NavLink>
//                 <NavLink to="#" className="albumnavlink" onClick={() => setSelectedGallery(GALLERY_IDS.Wedding)}>
//                     Wedding
//                 </NavLink>
//                 <NavLink to="#" className="albumnavlink" onClick={() => setSelectedGallery(GALLERY_IDS.Reception)}>
//                     Reception
//                 </NavLink>
//             </div>

//             <div className="segmented-control">
//                 <button
//                     className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
//                     onClick={() => setSelectedOption('allphotos')}
//                 >
//                     All Photos ({images.length})
//                 </button>
//                 <button
//                     className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
//                     onClick={() => setSelectedOption('selectedphotos')}
//                 >
//                     Selected Photos ({selectedPhotosCount})
//                 </button>
//             </div>

//             {loading ? (
//                 <div className="loading">Loading images...</div>
//             ) : selectedOption === 'allphotos' ? (
//                 <div>
//                     <div className="masonry-container">
//                         {images.map((image, index) => (
//                             <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
//                                 <img
//                                     src={image.src}
//                                     alt={image.alt}
//                                     className="img-fluid"
//                                     onLoad={() =>
//                                         setImageLoaded((prev) => ({ ...prev, [image.id]: true }))
//                                     }
//                                     style={{
//                                         opacity: imageLoaded[image.id] ? 1 : 0,
//                                         transition: 'opacity 0.3s ease-in-out',
//                                     }}
//                                     onClick={() => handleImage(index)}
//                                 />
//                                 {imageLoaded[image.id] && (
//                                     <div
//                                         className="checkbox-wrapper-18"
//                                         style={{
//                                             position: 'absolute',
//                                             top: '10px',
//                                             right: '10px',
//                                             zIndex: 10,
//                                         }}
//                                     >
//                                         <div className="round">
//                                             <input
//                                                 type="checkbox"
//                                                 id={`checkbox-${image.id}`}
//                                                 checked={selected[image.id] || false}
//                                                 onChange={() => handleselected(image.id)}
//                                             />
//                                             <label htmlFor={`checkbox-${image.id}`}></label>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <SelectedPhotos images={images.filter((image) => selected[image.id])} handleselected={handleselected} />
//             )}

//             {openedImage && (
//                 <div className="modal" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <button className="download-btn" onClick={handleDownload}>
//                             <img src={download} alt="" />
//                         </button>
//                         <button className="close-btn" onClick={closeModal}>
//                             &times;
//                         </button>
//                         <button className="prev-btn" onClick={handlePrevious}>
//                             <img src={previousArrow} alt="Previous" />
//                         </button>
//                         <img src={openedImage} alt="Full Image" className="modal-image" />
//                         <button className="next-btn" onClick={handleNext}>
//                             <img src={nextArrow} alt="Next" />
//                         </button>
//                         <button
//                             className={`selecttick ${selected[images[currentIndex]?.id] ? 'selected' : ''}`}
//                             onClick={() => handleselected(images[currentIndex]?.id)}
//                         >
//                             <img src={tick} alt="Select" />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {!openedImage && selectedPhotosCount > 0 && (
//                 <div className="senddiv">
//                     <button className="floating-button icon-send" onClick={handleSendSelectedPhotos}>
//                         Send
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Gallery;

import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs5-lightbox';
import Swal from 'sweetalert2';
import '../CSS/gallerystyle.css';
import nextArrow from '../assets/next.png';
import previousArrow from '../assets/back.png';
import logo from '../assets/logo.png';
import tick from '../assets/checkbox2.png';
import download from '../assets/download.png';
import SelectedPhotos from '../Components/SelectedPhotos.jsx';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import '../CSS/naveventstyle.css';
import axios from 'axios';  



function Gallery() {
    const { event_uuid } = useParams();
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState(null);
    const [galleries, setGalleries] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [selected, setSelected] = useState({});
    const [openedImage, setOpenedImage] = useState(null);
    const [galleryTitle, setGalleryTitle] = useState('');
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('allphotos');

    const galleryRef = useRef(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`https://web.snoxpro.com/public/api/v1/selection/${event_uuid}`);
                setEventDetails(response.data.event);
                setGalleries(response.data.galleries);
                setGalleryTitle(response.data.event.title); 
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch event details.');
                console.error('Error fetching event details:', err);
            }
        };
        fetchEventDetails();
    }, [event_uuid]);
    
    const handleGalleryClick = async (galleryUuid) => {
        try {
            const token = localStorage.getItem("authSelToken");
            const response = await axios.get(`https://web.snoxpro.com/public/api/v1/gallery/images/${galleryUuid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedGallery(galleryUuid);
            setImages(response.data.results); 
            setOpenedImage(null); 
            setCurrentIndex(null);
        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
        }
    };

    const handleSendSelectedPhotos = async () => {
        const selectedImagesData = images
            .filter((image) => selected[image.uuid])
            .map((image) => ({
                image_uuid: image.uuid,
                is_selected: true,
            }));

        const token = localStorage.getItem('authSelToken');
        const event_uuid = selectedGallery;

        try {
            const response = await fetch(`https://web.snoxpro.com/public/api/v1/selection/submit/${event_uuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    event_uuid,
                    selected_images: selectedImagesData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send selected photos');
            }

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Photos sent successfully!',
                text: result.message || 'Your selected photos have been successfully sent.',
            });
        } catch (error) {
            console.error('Error sending selected photos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error sending photos',
                text: 'There was an issue sending the selected photos. Please try again later.',
            });
        }
    };

    const handleselected = (uuid) => {
        const updatedSelected = { ...selected, [uuid]: !selected[uuid] };
        setSelected(updatedSelected);
    };

    const handleImage = (index) => {
        setCurrentIndex(index);
        setOpenedImage(images[index]?.image_url);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setOpenedImage(images[(currentIndex + 1) % images.length]?.image_url);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setOpenedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]?.image_url);
    };

    const closeModal = () => {
        setCurrentIndex(null);
        setOpenedImage(null);
    };

    const selectedPhotosCount = Object.values(selected).filter(Boolean).length;

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="maincontainer">
            <div className="navbar">
                <img className="logostyle" src={logo} alt="" />
            </div>
            <div className="galleryContent">
            {eventDetails ? (
                <h1>{eventDetails.title}</h1>
                
            ) : (
                <p>Loading event details...</p>
            )}
           
            </div>
                         <div className="segmented-control">
     <button
                    className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
                    onClick={() => setSelectedOption('allphotos')}
                >
                    All Photos ({images.length})
                </button>
                <button
                    className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
                    onClick={() => setSelectedOption('selectedphotos')}
                >
                    Selected Photos ({selectedPhotosCount})
                </button>
            </div>
            <div className="albumnav" ref={galleryRef}>
                {galleries.length > 0 ? (
                    galleries.map((gallery) => (
                        <div key={gallery.uuid}>
                            <NavLink
                                className={`albumnavlink ${selectedGallery === gallery.uuid ? "selected" : ""}`}
                                onClick={() => handleGalleryClick(gallery.uuid)}
                            >
                                {gallery.name} 
                            </NavLink>
                        </div>
                    ))
                ) : (
                    <p>No galleries available</p> 
                )}
            </div>

            <div className="masonry-container">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={image.uuid} className="gallery-item">
                            <img
                                src={image.image_url_thumb}
                                alt={`Image ${index + 1}`}
                                className="img-fluid"
                                onClick={() => handleImage(index)}
                                style={{ cursor: "pointer" }}
                            />
                            <div className="checkbox-wrapper-18">
                                <input
                                    type="checkbox"
                                    checked={selected[image.uuid] || false}
                                    onChange={() => handleselected(image.uuid)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No images available for this gallery.</p>
                )}
            </div>

            {openedImage && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content">
                        <img src={openedImage} alt="Full View" />
                        <button onClick={handlePrevious}>Prev</button>
                        <button onClick={handleNext}>Next</button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
             {!openedImage && selectedPhotosCount > 0 && (
                <div className="senddiv">
                    <button className="floating-button icon-send" onClick={handleSendSelectedPhotos}>
                        Send
                    </button>
                </div>
            )}
            {/* <button onClick={handleSendSelectedPhotos}>Send Selected</button> */}
        </div>
    );
}

export default Gallery;
