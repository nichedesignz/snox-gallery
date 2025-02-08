


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, NavLink } from 'react-router-dom';
// import download from '../assets/download.png';
// import nextArrow from '../assets/next.png';
// import previousArrow from '../assets/back.png';
// import tick from '../assets/checkbox2.png';  
// import '../CSS/gallerystyle.css';
// import '../CSS/naveventstyle.css';
// import logo from '../assets/logo.png';
// import Swal from 'sweetalert2'; 

// const BASE_URL = "https://web.snoxpro.com/public/api/v1/selection";

// const Gallery = () => {
//     const [eventDetails, setEventDetails] = useState(null);
//     const { event_uuid } = useParams(); 
//     const [galleries, setGalleries] = useState([]);
//     const [selectedGallery, setSelectedGallery] = useState(null); 
//     const [images, setImages] = useState([]);
//     const [openedImage, setOpenedImage] = useState(null);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selected, setSelected] = useState({}); 
//     const [error, setError] = useState(null);
//     const [imageLoaded, setImageLoaded] = useState({});
//     const [selectedOption, setSelectedOption] = useState('allphotos');
//     const [currentPage, setCurrentPage] = useState(1);
//     const imagesPerPage = 10; 

//     useEffect(() => {
    
//             const fetchEventData = async () => {
//                 try {
//                     const token = localStorage.getItem('authToken');
//                     const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });
//                     setEventDetails(response.data.event);
//                     setGalleries(response.data.galleries);
    
//                     if (response.data.galleries.length > 0) {
//                         handleGalleryClick(response.data.galleries[0].uuid);
//                     } else {
//                         setLoading(false);
//                     }
//                 } catch (err) {
//                     setError("Failed to load galleries.");
//                     console.error("Error fetching galleries:", err);
//                     setLoading(false);
//                 }
//             };
//             fetchEventData();
//         }, [event_uuid]);
//     // if (loading) {
//     //     return (
//     //       <div className="loader-wrapperselection">
//     //         <div className="loaderselection"></div>
//     //       </div>
//     //     );
//     //   }

//     const selectedPhotosCount = Object.values(selected[selectedGallery] || {}).filter(Boolean).length;

//     const handleSelectedOption = (option) => {
//         setSelectedOption(option);
//     };

//     const handleGalleryClick = async (galleryUuid) => {
//         try {
//             const token = localStorage.getItem('authSelToken');
//             const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setSelectedGallery(galleryUuid);
//             setImages(response.data.results); 
//             setOpenedImage(null); 
//             setCurrentIndex(null); 
//             setLoading(false);
//         } catch (err) {
//             setError("Failed to load gallery images.");
//             console.error("Error fetching gallery images:", err);
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loader-wrapper">
//                 <div className="loader"></div>
//             </div>
//         );
//     }

//     const handleselected = (galleryUuid, imageUuid) => {
//         setSelected((prevSelected) => ({
//             ...prevSelected,
//             [galleryUuid]: {
//                 ...prevSelected[galleryUuid],
//                 [imageUuid]: !prevSelected[galleryUuid]?.[imageUuid],
//             },
//         }));
//     };

//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index]?.image_url);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length]?.image_url);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? images.length - 1 : prevIndex - 1
//         );
//         setOpenedImage(
//             images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
//                 ?.image_url
//         );
//     };

//     const closeModal = () => {
//         setCurrentIndex(null);
//         setOpenedImage(null);
//     };

//     const handleDownload = () => {
//         const link = document.createElement('a');
//         link.href = openedImage;
//         link.download = `Image_${currentIndex + 1}.jpeg`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
    

//   const handleSend = async () => {
//     if (!selectedGallery) return;

//     const selectedImages = Object.keys(selected[selectedGallery] || {}).filter(
//         (imageUuid) => selected[selectedGallery][imageUuid]
//     );

//     if (selectedImages.length === 0) {
//         alert("No images selected.");
//         return;
//     }

//     console.log("Sending Data:");
//     console.log("Gallery UUID:", selectedGallery);
//     console.log("Selected Images:", selectedImages);

//     function filterSlectedIds(){
//             const selectedUuids = Object.keys(selected[selectedGallery] || {}).filter(
//                 (imageUuid) => selected[selectedGallery][imageUuid]
//             );
        
//             const selectedImageIds = images.filter(image => selectedUuids.includes(image.uuid))
//             .map(image => image.id);

//         return selectedImageIds;
//     }

//     try {
//         const token = localStorage.getItem('authSelToken');
//         const ids = filterSlectedIds();
//         console.log("ids " + filterSlectedIds())
//         const payload = {"selected_photos" : ids}

//         const response = await axios.post(
//             `${BASE_URL}/submit/${selectedGallery}/`,payload,
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//             }
//         );

//         console.log("Server Response:", response.data);

//         // alert("Images submitted successfully!");

//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Images submitted successfully!',
//           confirmButtonText: 'OK',
//       });

//     } catch (error) {
//         console.error("Error submitting images:", error);
//         alert("Failed to submit images.");
//     }
// };


//     return (
      
//         <div className="maincontainer">
//             <div className="navbar">
//                 <img className="logostyle" src={logo} alt="Logo" />
//             </div>

//             <div className="galleryContent">
//                 {eventDetails ? (
//                     <h1>{eventDetails.title}</h1>
//                 ) : (
//                     <p>Loading event details...</p>
//                 )}
//             </div>

//             <div className="albumnav">
//                 {galleries.map((gallery) => (
//                     <button
//                         key={gallery.uuid}
//                         className={`albumnavlink ${selectedGallery === gallery.uuid ? 'active' : ''}`}
//                         onClick={() => handleGalleryClick(gallery.uuid)}
//                     >
//                         {gallery.name}
//                     </button>
//                 ))}
//             </div>

//             <div className="segmented-control">
//                 <button
//                     className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
//                     onClick={() => handleSelectedOption('allphotos')}
//                 >
//                     All Photos ({images.length})
//                 </button>
//                 <button
//                     className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
//                     onClick={() => handleSelectedOption('selectedphotos')}
                
//                 >
//                     Selected Photos ({selectedPhotosCount})
//                 </button>
//             </div>

//             {selectedOption === 'allphotos' ? (
//     <div className="masonry-container">
//         {images.map((image, index) => (
//             <div key={image.uuid} className="masonry-item" style={{ position: 'relative' }}>
//                 <img
//                     src={image.image_url}
//                     alt={`Image ${index + 1}`}
//                     className="img-fluid"
//                     onLoad={() =>
//                         setImageLoaded((prev) => ({ ...prev, [image.uuid]: true }))
//                     }
//                     style={{ 
//                         opacity: imageLoaded[image.uuid] ? 1 : 0, 
//                         transition: 'opacity 0.3s ease-in-out' 
//                     }}
//                     onClick={() => handleImage(index)}
//                 />
                
//                 {imageLoaded[image.uuid] && ( 
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
//                                 id={`checkbox-${image.uuid}`}
//                                 checked={selected[selectedGallery]?.[image.uuid] || false}
//                                 onChange={() => handleselected(selectedGallery, image.uuid)}
//                             />
//                             <label htmlFor={`checkbox-${image.uuid}`}></label>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         ))}
//     </div>


//             ) : (
//                 <div className="masonry-container">
//                     {images
//                         .filter((image) => selected[selectedGallery]?.[image.uuid])
//                         .map((image, index) => (
//                             <div key={index} className="gallery-item">
//                                 <img
//                                     src={image.image_url}
//                                     alt={`Selected Image ${index + 1}`}
//                                     className="img-fluid"
                                  
//                                 />
//                             </div>
//                         ))}
//                     {images.filter((image) => selected[selectedGallery]?.[image.uuid]).length === 0 && (
//                         <p>No selected photos.</p>
//                     )}
//                 </div>
//             )}

//             {openedImage && (
//                 <div className="modal" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <button className="download-btn" onClick={handleDownload}>
//                             <img src={download} alt="Download" />
//                         </button>
//                         <button className="close-btn" onClick={closeModal}>
//                             &times;
//                         </button>
//                         <button className="prev-btn" onClick={handlePrevious}>
//                             <img src={previousArrow} alt="Previous" />
//                         </button>
//                         <img src={openedImage} alt="Full view" className="modal-image" />
//                         <button className="next-btn" onClick={handleNext}>
//                             <img src={nextArrow} alt="Next" />
//                         </button>
//                         <button
//                             className={`selecttick ${selected[selectedGallery]?.[images[currentIndex]?.uuid] ? 'selected' : ''}`}
//                             onClick={() => handleselected(selectedGallery, images[currentIndex]?.uuid)}
//                         >
//                             <img src={tick} alt="Select" />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {selectedPhotosCount > 0 && (
//                 <div className="senddiv">
//                     <button className="floating-button icon-send" onClick={handleSend}>
//                         Send ({selectedPhotosCount})
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Gallery;




//corrected code:

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, NavLink } from 'react-router-dom';
// import download from '../assets/download.png';
// import nextArrow from '../assets/next.png';
// import previousArrow from '../assets/back.png';
// import tick from '../assets/checkbox2.png';  
// import '../CSS/gallerystyle.css';
// import '../CSS/naveventstyle.css';
// import logo from '../assets/logo.png';
// import Swal from 'sweetalert2'; 

// const BASE_URL = "https://web.snoxpro.com/public/api/v1/selection";

// const Gallery = () => {
//     const [eventDetails, setEventDetails] = useState(null);
//     const { event_uuid } = useParams(); 
//     const [galleries, setGalleries] = useState([]);
//     const [selectedGallery, setSelectedGallery] = useState(null); 
//     const [images, setImages] = useState([]);
//     const [openedImage, setOpenedImage] = useState(null);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selected, setSelected] = useState({}); 
//     const [error, setError] = useState(null);
//     const [imageLoaded, setImageLoaded] = useState({});
//     const [selectedOption, setSelectedOption] = useState('allphotos');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [maxSelection, setMaxSelection] = useState({});
//     const imagesPerPage = 10; 

//     useEffect(() => {
    
//             const fetchEventData = async () => {
//                 try {
//                     const token = localStorage.getItem('authToken');
//                     const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });
//                     setEventDetails(response.data.event);
//                     setGalleries(response.data.galleries);
    
//                     if (response.data.galleries.length > 0) {
//                         handleGalleryClick(response.data.galleries[0].uuid);
//                     }
//                      else {
//                         setLoading(false);
//                     }
//                 } catch (err) {
//                     setError("Failed to load galleries.");
//                     console.error("Error fetching galleries:", err);
//                     setLoading(false);
//                 }
//             };
//             fetchEventData();
//         }, [event_uuid]);
//     // if (loading) {
//     //     return (
//     //       <div className="loader-wrapperselection">
//     //         <div className="loaderselection"></div>
//     //       </div>
//     //     );
//     //   }
//     const fetchMaxSelection = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
    
//             console.log("API Response for max selection:", response.data);
    
//             if (response.data.galleries.length > 0) {
               
//                 const gallerySelections = response.data.galleries.reduce((acc, gallery) => {
//                     const maxSelection = gallery.selection_info?.max_selection ?? 25;
//                     acc[gallery.uuid] = maxSelection; 
//                     return acc;
//                 }, {});
    
//                 setMaxSelection(gallerySelections);
//             } else {
//                 console.error("No galleries found in response");
//             }
//         } catch (error) {
//             console.error("Error fetching max selection:", error);
//         }
//     };
    
//     useEffect(() => {
//         fetchMaxSelection();
//     }, [event_uuid]);
    
//     useEffect(() => {
//         console.log("Updated maxSelection:", maxSelection);
//     }, [maxSelection]);
    
//     const selectedPhotosCount = Object.values(selected[selectedGallery] || {}).filter(Boolean).length;

//     const handleSelectedOption = (option) => {
//         setSelectedOption(option);
//     };

//     const handleGalleryClick = async (galleryUuid) => {
//         try {
//             const token = localStorage.getItem('authSelToken');
//             const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setSelectedGallery(galleryUuid);
//             setImages(response.data.results); 
//             setOpenedImage(null); 
//             setCurrentIndex(null); 
//             setLoading(false);
//         } catch (err) {
//             setError("Failed to load gallery images.");
//             console.error("Error fetching gallery images:", err);
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loader-wrapper">
//                 <div className="loader"></div>
//             </div>
//         );
//     }

//     const handleselected = (galleryUuid, imageUuid) => {
//         const selectedCount = Object.values(selected[galleryUuid] || {}).filter(Boolean).length;
//         const maxAllowed = maxSelection[galleryUuid] || 25; 
    
//         if (!selected[galleryUuid]?.[imageUuid] && selectedCount >= maxAllowed) {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Selection Limit Reached',
//                 text: `You can only select upto ${maxAllowed} images.`,
//                 confirmButtonText: 'OK',
//             });
//             return;
//         }
    
//         setSelected((prevSelected) => ({
//             ...prevSelected,
//             [galleryUuid]: {
//                 ...prevSelected[galleryUuid],
//                 [imageUuid]: !prevSelected[galleryUuid]?.[imageUuid],
//             },
//         }));
//     };
    
    
//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index]?.image_url);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length]?.image_url);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? images.length - 1 : prevIndex - 1
//         );
//         setOpenedImage(
//             images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
//                 ?.image_url
//         );
//     };

//     const closeModal = () => {
//         setCurrentIndex(null);
//         setOpenedImage(null);
//     };

//     const handleDownload = () => {
//         const link = document.createElement('a');
//         link.href = openedImage;
//         link.download = `Image_${currentIndex + 1}.jpeg`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
    

//   const handleSend = async () => {
//     if (!selectedGallery) return;

//     const selectedImages = Object.keys(selected[selectedGallery] || {}).filter(
//         (imageUuid) => selected[selectedGallery][imageUuid]
//     );

//     if (selectedImages.length === 0) {
//         alert("No images selected.");
//         return;
//     }

//     console.log("Sending Data:");
//     console.log("Gallery UUID:", selectedGallery);
//     console.log("Selected Images:", selectedImages);

//     function filterSlectedIds(){
//             const selectedUuids = Object.keys(selected[selectedGallery] || {}).filter(
//                 (imageUuid) => selected[selectedGallery][imageUuid]
//             );
        
//             const selectedImageIds = images.filter(image => selectedUuids.includes(image.uuid))
//             .map(image => image.id);

//         return selectedImageIds;
//     }

//     try {
//         const token = localStorage.getItem('authSelToken');
//         const ids = filterSlectedIds();
//         console.log("ids " + filterSlectedIds())
//         const payload = {"selected_photos" : ids}

//         const response = await axios.post(
//             `${BASE_URL}/submit/${selectedGallery}/`,payload,
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//             }
//         );

//         console.log("Server Response:", response.data);

//         // alert("Images submitted successfully!");

//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Images submitted successfully!',
//           confirmButtonText: 'OK',
//       });

//     } catch (error) {
//         console.error("Error submitting images:", error);
//         alert("Failed to submit images.");
//     }
// };


//     return (
      
//         <div className="maincontainer">
//             <div className="navbar">
//                 <img className="logostyle" src={logo} alt="Logo" />
//             </div>

//             <div className="galleryContent">
//                 {eventDetails ? (
//                     <h1>{eventDetails.title}</h1>
//                 ) : (
//                     <p>Loading event details...</p>
//                 )}
//             </div>

//             <div className="albumnav">
//                 {galleries.map((gallery) => (
//                     <button
//                         key={gallery.uuid}
//                         className={`albumnavlink
//                              ${selectedGallery === gallery.uuid ? 'selected' : ""

//                              }`}
//                         onClick={() => handleGalleryClick(gallery.uuid)}
//                     >
//                         {gallery.name}
//                     </button>
//                 ))}
//             </div>

//             <div className="segmented-control">
//                 <button
//                     className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
//                     onClick={() => handleSelectedOption('allphotos')}
//                 >
//                     All Photos ({images.length})
//                 </button>
//                 <button
//                     className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
//                     onClick={() => handleSelectedOption('selectedphotos')}
                
//                 >
//                     Selected Photos ({selectedPhotosCount})
//                 </button>
//             </div>

//             {selectedOption === 'allphotos' ? (
//     <div className="masonry-container">
//         {images.map((image, index) => (
//             <div key={image.uuid} className="masonry-item" style={{ position: 'relative' }}>
//                 <img
//                     src={image.image_url}
//                     alt={`Image ${index + 1}`}
//                     className="img-fluid"
//                     onLoad={() =>
//                         setImageLoaded((prev) => ({ ...prev, [image.uuid]: true }))
//                     }
//                     style={{ 
//                         opacity: imageLoaded[image.uuid] ? 1 : 0, 
//                         transition: 'opacity 0.3s ease-in-out' 
//                     }}
//                     onClick={() => handleImage(index)}
//                 />
                
//                 {imageLoaded[image.uuid] && ( 
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
//                                 id={`checkbox-${image.uuid}`}
//                                 checked={selected[selectedGallery]?.[image.uuid] || false}
//                                 onChange={() => handleselected(selectedGallery, image.uuid)}
//                             />
//                             <label htmlFor={`checkbox-${image.uuid}`}></label>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         ))}
//     </div>


//             ) : (
//                 <div className="masonry-container">
//                     {images
//                         .filter((image) => selected[selectedGallery]?.[image.uuid])
//                         .map((image, index) => (
//                             <div key={index} className="gallery-item">
//                                 <img
//                                     src={image.image_url}
//                                     alt={`Selected Image ${index + 1}`}
//                                     className="img-fluid"
                                  
//                                 />
//                             </div>
//                         ))}
//                     {images.filter((image) => selected[selectedGallery]?.[image.uuid]).length === 0 && (
//                         <p>No selected photos.</p>
//                     )}
//                 </div>
//             )}

//             {openedImage && (
//                 <div className="modal" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <button className="download-btn" onClick={handleDownload}>
//                             <img src={download} alt="Download" />
//                         </button>
//                         <button className="close-btn" onClick={closeModal}>
//                             &times;
//                         </button>
//                         <button className="prev-btn" onClick={handlePrevious}>
//                             <img src={previousArrow} alt="Previous" />
//                         </button>
//                         <img src={openedImage} alt="Full view" className="modal-image" />
//                         <button className="next-btn" onClick={handleNext}>
//                             <img src={nextArrow} alt="Next" />
//                         </button>
//                         <button
//                             className={`selecttick ${selected[selectedGallery]?.[images[currentIndex]?.uuid] ? 'selected' : ''}`}
//                             onClick={() => handleselected(selectedGallery, images[currentIndex]?.uuid)}
//                         >
//                             <img src={tick} alt="Select" />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {selectedPhotosCount > 0 && (
//                 <div className="senddiv">
//                     <button className="floating-button icon-send" onClick={handleSend}>
//                         Send ({selectedPhotosCount})
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Gallery;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';
import download from '../assets/download.png';
import nextArrow from '../assets/next.png';
import previousArrow from '../assets/back.png';
import tick from '../assets/checkbox2.png';  
import '../CSS/gallerystyle.css';
import '../CSS/naveventstyle.css';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2'; 

const BASE_URL = "https://web.snoxpro.com/public/api/v1/selection";

const Gallery = () => {
    const [eventDetails, setEventDetails] = useState(null);
    const { event_uuid } = useParams(); 
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null); 
    const [images, setImages] = useState([]);
    const [openedImage, setOpenedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState({}); 
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState({});
    const [selectedOption, setSelectedOption] = useState('allphotos');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxSelection, setMaxSelection] = useState({});
   

    const imagesPerPage = 10; 

    useEffect(() => {
    
            const fetchEventData = async () => {
                try {
                    const token = localStorage.getItem('authSelToken');
                    const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEventDetails(response.data.event);
                    setGalleries(response.data.galleries);
    
                    if (response.data.galleries.length > 0) {
                        handleGalleryClick(response.data.galleries[0].uuid);
                    }
                     else {
                        setLoading(false);
                    }
                } catch (err) {
                    setError("Failed to load galleries.");
                    console.error("Error fetching galleries:", err);
                    setLoading(false);
                }
            };
            fetchEventData();
        }, [event_uuid]);
    // if (loading) {
    //     return (
    //       <div className="loader-wrapperselection">
    //         <div className="loaderselection"></div>
    //       </div>
    //     );
    //   }
    const fetchMaxSelection = async () => {
        try {
            const token = localStorage.getItem('authSelToken');
            const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("API Response for max selection:", response.data);
    
            if (response.data.galleries.length > 0) {
               
                const gallerySelections = response.data.galleries.reduce((acc, gallery) => {
                    const maxSelection = gallery.selection_info?.max_selection ?? 25;
                    acc[gallery.uuid] = maxSelection; 
                    return acc;
                }, {});
    
                setMaxSelection(gallerySelections);
            } else {
                console.error("No galleries found in response");
            }
        } catch (error) {
            console.error("Error fetching max selection:", error);
        }
    };
    
    useEffect(() => {
        fetchMaxSelection();
    }, [event_uuid]);
    
    useEffect(() => {
        console.log("Updated maxSelection:", maxSelection);
    }, [maxSelection]);
    
    const selectedPhotosCount = Object.values(selected[selectedGallery] || {}).filter(Boolean).length;

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    const handleGalleryClick = async (galleryUuid) => {
        try {
            const token = localStorage.getItem('authSelToken');
            const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
         
            const gallery = response.data.results;
            const galleryInfo = galleries.find(g => g.uuid === galleryUuid);
            if (galleryInfo?.selection_info?.is_locked) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Selection Locked',
                    text: 'This gallery is locked. You cannot make selections.',
                    confirmButtonText: 'OK',
                });
            } else {
                setSelectedGallery(galleryUuid);
                setImages(gallery); 
                setOpenedImage(null); 
                setCurrentIndex(null); 
                setLoading(false);
            }
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

    
    const handleselected = (galleryUuid, imageUuid) => {
        const galleryInfo = galleries.find(g => g.uuid === galleryUuid);
        const imageData = images.find(img => img.uuid === imageUuid);
    
        if (galleryInfo?.selection_info?.is_locked) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Locked',
                text: 'This gallery is locked. You cannot make selections.',
                confirmButtonText: 'OK',
            });
            return;
        }
    
       
        if (imageData?.is_selected) {
            Swal.fire({
                icon: 'info',
                title: 'Cannot Deselect',
                text: 'This image has already been selected and sent.',
                confirmButtonText: 'OK',
            });
            return;
        }
    
      
        const selectedCount = Object.values(selected[galleryUuid] || {}).filter(Boolean).length;
        const maxAllowed = maxSelection[galleryUuid] || 25;
    
        if (!selected[galleryUuid]?.[imageUuid] && selectedCount >= maxAllowed) {
            Swal.fire({
                icon: 'info',
                title: 'Selection Limit Reached',
                text: `You can only select up to ${maxAllowed} images.`,
                confirmButtonText: 'OK',
            });
            return;
        }
    
   
        setSelected((prevSelected) => ({
            ...prevSelected,
            [galleryUuid]: {
                ...prevSelected[galleryUuid],
                [imageUuid]: !prevSelected[galleryUuid]?.[imageUuid],
            },
        }));
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
        setOpenedImage(
            images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
                ?.image_url
        );
    };

    const closeModal = () => {
        setCurrentIndex(null);
        setOpenedImage(null);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = openedImage;
        link.download = `Image_${currentIndex + 1}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const fetchUpdatedSelection = async () => {
        try {
            const token = localStorage.getItem('authSelToken');
            const response = await axios.get(`${BASE_URL}/images/${selectedGallery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const updatedImages = response.data.results;
    
            setImages(updatedImages);
    
    
            const newSelectionState = updatedImages.reduce((acc, image) => {
                acc[image.uuid] = image.is_selected; 
                return acc;
            }, {});
    
            setSelected((prevSelected) => ({
                ...prevSelected,
                [selectedGallery]: newSelectionState,
            }));
    
        } catch (error) {
            console.error("Error fetching updated selection:", error);
        }
    };
    
    const handleSend = async () => {
        if (!selectedGallery) return;
    
        const galleryInfo = galleries.find(g => g.uuid === selectedGallery);
    
        if (galleryInfo?.selection_info?.is_locked) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Locked',
                text: 'This gallery is locked. You cannot send images.',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        // const selectedImages = Object.keys(selected[selectedGallery] || {}).filter(
        //     (imageUuid) => selected[selectedGallery][imageUuid] && !images.find(img => img.uuid === imageUuid)?.is_selected
        // );
        const selectedUuids = Object.keys(selected[selectedGallery] || {}).filter(
            (imageUuid) => selected[selectedGallery][imageUuid] && !images.find(img => img.uuid === imageUuid)?.is_selected
        );
        const selectedImageIds = images
        .filter(image => selectedUuids.includes(image.uuid))
        .map(image => image.id);

    console.log("Selected Image UUIDs:", selectedUuids);
    console.log("Mapped Image IDs:", selectedImageIds);
        // if (selectedImages.length === 0) {
        //     alert("No images selected.");
        //     return;
        // }
    
    //     function filterSelectedIds() {
    //         return images
    //             .filter(image => selectedImages.includes(image.uuid))
    //             .map(image => image.id);
    //     }
    
    //     try {
    //         const token = localStorage.getItem('authSelToken');
    //         const ids = filterSelectedIds();
    //         const payload = { "selected_photos": ids };
    
    //         await axios.post(`${BASE_URL}/submit/${selectedGallery}/`, payload, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Success!',
    //             text: 'Images submitted successfully!',
    //             confirmButtonText: 'OK',
    //         });
    
          
    //         fetchUpdatedSelection();
    
    //     } catch (error) {
    //         console.error("Error submitting images:", error);
    //         alert("Failed to submit images.");
    //     }
    // };
    
    
    
    function filterSlectedIds() {
        const selectedUuids = Object.keys(selected[selectedGallery] || {}).filter(
            (imageUuid) => selected[selectedGallery][imageUuid]
        );
    
        console.log("Selected UUIDs:", selectedUuids); 
    
        const selectedImageIds = images
            .filter(image => selectedUuids.includes(image.uuid))
            .map(image => image.id);
    
     
    
        return selectedImageIds;
    }
    
    try {
        const token = localStorage.getItem('authSelToken');
        const ids = filterSlectedIds();
        console.log("ids " + filterSlectedIds())
        const payload = {"selected_photos" : ids}
        console.log("Sending images payload:", JSON.stringify(payload, null, 2));
        const response = await axios.post(
            `${BASE_URL}/submit/${selectedGallery}/`,payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );


       
        console.log("Server Response:", response.data);

        setImages((prevImages) =>
            prevImages.map((img) =>
                selectedImageIds.includes(img.id) ? { ...img, is_selected: true } : img
            )
        );

     
        setSelected((prevSelected) => ({
            ...prevSelected,
            [selectedGallery]: {},
        }));
        const finalSelectedImageIds = images
        .filter(img => img.is_selected || selectedImageIds.includes(img.id))
        .map(img => img.id);

    console.log("Final Selected Image IDs after sending:", finalSelectedImageIds);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Images submitted successfully!',
          confirmButtonText: 'OK',
      });
      
} 
 catch (error) {
        console.error("Error submitting images:", error);
        alert("Failed to submit images.");
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
                        key={gallery.uuid}
                        className={`albumnavlink
                             ${selectedGallery === gallery.uuid ? 'selected' : ""

                             }`}
                        onClick={() => handleGalleryClick(gallery.uuid)}
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
            <div key={image.uuid} className="masonry-item" style={{ position: 'relative' }}>
                <img
                    src={image.image_url}
                    alt={`Image ${index + 1}`}
                    className="img-fluid"
                    onLoad={() =>
                        setImageLoaded((prev) => ({ ...prev, [image.uuid]: true }))
                    }
                    style={{ 
                        opacity: imageLoaded[image.uuid] ? 1 : 0, 
                        transition: 'opacity 0.3s ease-in-out' 
                    }}
                    onClick={() => handleImage(index)}
                />
                
                {imageLoaded[image.uuid] && ( 


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
                                id={`checkbox-${image.uuid}`}
                                checked={selected[selectedGallery]?.[image.uuid] || false}
                                              onChange={() => {
                   const galleryInfo = galleries.find(g => g.uuid === selectedGallery);
                   if (galleryInfo?.selection_info?.is_locked) {
                       Swal.fire({
                           icon: 'warning',
                           title: 'Selection Locked',
                           text: 'This gallery is locked. You cannot make selections.',
                           confirmButtonText: 'OK',
                       });
                       return;
                   }
                   handleselected(selectedGallery, image.uuid); 
               }}
           />
                            <label htmlFor={`checkbox-${image.uuid}`}></label>
                        </div>
                    </div>
                )}
            </div>
        ))}
    </div>


            ) : (
                <div className="masonry-container">
                    {images
                        .filter((image) => selected[selectedGallery]?.[image.uuid])
                        .map((image, index) => (
                            <div key={index} className="gallery-item">
                                <img
                                    src={image.image_url}
                                    alt={`Selected Image ${index + 1}`}
                                    className="img-fluid"
                                  
                                />
                            </div>
                        ))}
                    {images.filter((image) => selected[selectedGallery]?.[image.uuid]).length === 0 && (
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
                            className={`selecttick ${selected[selectedGallery]?.[images[currentIndex]?.uuid] ? 'selected' : ''}`}
                            onClick={() => handleselected(selectedGallery, images[currentIndex]?.uuid)}
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



