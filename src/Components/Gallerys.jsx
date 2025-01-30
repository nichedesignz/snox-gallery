// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, NavLink } from 'react-router-dom';
// import download from '../assets/download.png';
// import nextArrow from '../assets/next.png'; 
// import previousArrow from '../assets/back.png';
// import tick from '../assets/checkbox2.png';  
// import '../CSS/gallerystyle.css';

// import '../CSS/naveventstyle.css'
// import logo from '../assets/logo.png';
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
//     const [selectedOption, setSelectedOption] = useState('allphotos');
//     const [currentPage, setCurrentPage] = useState(1); // Pagination state
//     const imagesPerPage = 10; // Number of images per page
    
//     useEffect(() => {
//       const fetchEventData = async () => {
//         try {
//           const token = localStorage.getItem('authToken');
//           const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setEventDetails(response.data.event);
//           const galleriesData = response.data.galleries;
//           setGalleries(galleriesData);
  
          
//           if (galleriesData.length > 0) {
//             handleGalleryClick(galleriesData[0].uuid);
//           }
//         } catch (err) {
//           setError("Failed to load galleries.");
//           console.error("Error fetching galleries:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchEventData();
//     }, [event_uuid]);
  
//     const selectedPhotosCount = Object.values(selected)
//       .map((gallerySelections) =>
//         Object.values(gallerySelections).filter(Boolean)
//       )
//       .flat().length;
  
//     const handleSelectedOption = (option) => {
//       setSelectedOption(option);
//     };
  
//     const handleGalleryClick = async (galleryUuid) => {
//       try {
//         const token = localStorage.getItem('authSelToken');
//         const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSelectedGallery(galleryUuid);
//         setImages(response.data.results); 
//         setOpenedImage(null); 
//         setCurrentIndex(null); 
//       } catch (err) {
//         setError("Failed to load gallery images.");
//         console.error("Error fetching gallery images:", err);
//       }
//     };
  
//     const handleselected = (galleryUuid, imageUuid) => {
//       setSelected((prevSelected) => ({
//         ...prevSelected,
//         [galleryUuid]: {
//           ...prevSelected[galleryUuid],
//           [imageUuid]: !prevSelected[galleryUuid]?.[imageUuid],
//         },
//       }));
//     };
  
//     const handleImage = (index) => {
//       setCurrentIndex(index);
//       setOpenedImage(images[index]?.image_url);
//     };
  
//     const handleNext = () => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//       setOpenedImage(images[(currentIndex + 1) % images.length]?.image_url);
//     };
  
//     const handlePrevious = () => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? images.length - 1 : prevIndex - 1
//       );
//       setOpenedImage(
//         images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
//           ?.image_url
//       );
//     };
  
//     const closeModal = () => {
//       setCurrentIndex(null);
//       setOpenedImage(null);
//     };
  
//     const handleDownload = () => {
//       const link = document.createElement('a');
//       link.href = openedImage;
//       link.download = `Image_${currentIndex + 1}.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     };
  
//     if (loading) {
//       return <div className="loading">Loading galleries...</div>;
//     }
  
//     if (error) {
//       return <div>{error}</div>;
//     }
  
//     return (
//       <div className="maincontainer">
//         <div className="navbar">
//           <img className="logostyle" src={logo} alt="Logo" />
//         </div>
  
//         <div className="galleryContent">
//           {eventDetails ? (
//             <h1>{eventDetails.title}</h1>
//           ) : (
//             <p>Loading event details...</p>
//           )}
//         </div>
  
//         <div className="albumnav">
//           {galleries.map((gallery) => (
//             <button
//               key={gallery.uuid}
//               className={`albumnavlink ${selectedGallery === gallery.uuid ? 'active' : ''}`}
//               onClick={() => handleGalleryClick(gallery.uuid)}
//             >
//               {gallery.name}
//             </button>
//           ))}
//         </div>
  
//         <div className="segmented-control">
//           <button
//             className={`segment ${selectedOption === 'allphotos' ? 'active' : ''}`}
//             onClick={() => handleSelectedOption('allphotos')}
//           >
//             All Photos ({images.length})
//           </button>
//           <button
//             className={`segment ${selectedOption === 'selectedphotos' ? 'active' : ''}`}
//             onClick={() => handleSelectedOption('selectedphotos')}
//           >
//             Selected Photos ({selectedPhotosCount})
//           </button>
//         </div>
  
        
//         {selectedOption === 'allphotos' ? (
//           <div className="masonry-container">
//             {images.map((image, index) => (
//               <div key={image.uuid} className="masonry-item" style={{ position: 'relative' }}>
//                 <img
//                   src={image.image_url_thumb}
//                   alt={`Image ${index + 1}`}
//                   className="img-fluid"
//                   onClick={() => handleImage(index)}
//                   style={{ cursor: 'pointer' }}
//                 />
//                 <div
//                   className="checkbox-wrapper-18"
//                   style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     zIndex: 10,
//                   }}
//                 >
//                   <div className="round">
//                     <input
//                       type="checkbox"
//                       id={`checkbox-${image.uuid}`}
//                       checked={selected[selectedGallery]?.[image.uuid] || false}
//                       onChange={() => handleselected(selectedGallery, image.uuid)}
//                     />
//                     <label htmlFor={`checkbox-${image.uuid}`}></label>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="masonry-container">
//             {images
//               .filter((image) => selected[selectedGallery]?.[image.uuid])
//               .map((image, index) => (
//                 <div key={index} className="gallery-item">
//                   <img
//                     src={image.image_url}
//                     alt={`Selected Image ${index + 1}`}
//                     className="img-fluid"
//                   />
//                 </div>
//               ))}
//             {images.filter((image) => selected[selectedGallery]?.[image.uuid]).length === 0 && (
//               <p>No selected photos.</p>
//             )}
//           </div>
//         )}
  
//         {openedImage && (
//           <div className="modal" onClick={closeModal}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <button className="download-btn" onClick={handleDownload}>
//                 <img src={download} alt="Download" />
//               </button>
//               <button className="close-btn" onClick={closeModal}>
//                 &times;
//               </button>
//               <button className="prev-btn" onClick={handlePrevious}>
//                 <img src={previousArrow} alt="Previous" />
//               </button>
//               <img src={openedImage} alt="Full view" className="modal-image" />
//               <button className="next-btn" onClick={handleNext}>
//                 <img src={nextArrow} alt="Next" />
//               </button>
//               <button
//                 className={`selecttick ${
//                   selected[selectedGallery]?.[images[currentIndex]?.uuid] ? 'selected' : ''
//                 }`}
//                 onClick={() => handleselected(selectedGallery, images[currentIndex]?.uuid)}
//               >
//                 <img src={tick} alt="Select" />
//               </button>
//             </div>
//           </div>
//         )}
//        {selectedPhotosCount > 0 && (
//                 <div className="senddiv">
//                     <button className="floating-button icon-send" >
//                         Send({selectedPhotosCount})
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

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
    const [selectedOption, setSelectedOption] = useState('allphotos');
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 10; 

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEventDetails(response.data.event);
                const galleriesData = response.data.galleries;
                setGalleries(galleriesData);

                if (galleriesData.length > 0) {
                    handleGalleryClick(galleriesData[0].uuid);
                }
            } catch (err) {
                setError("Failed to load galleries.");
                console.error("Error fetching galleries:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [event_uuid]);

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
            setSelectedGallery(galleryUuid);
            setImages(response.data.results); 
            setOpenedImage(null); 
            setCurrentIndex(null); 
            
        } catch (err) {
            setError("Failed to load gallery images.");
            console.error("Error fetching gallery images:", err);
        }
    };

    const handleselected = (galleryUuid, imageUuid) => {
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
    

  const handleSend = async () => {
    if (!selectedGallery) return;

    const selectedImages = Object.keys(selected[selectedGallery] || {}).filter(
        (imageUuid) => selected[selectedGallery][imageUuid]
    );

    if (selectedImages.length === 0) {
        alert("No images selected.");
        return;
    }

    console.log("Sending Data:");
    console.log("Gallery UUID:", selectedGallery);
    console.log("Selected Images:", selectedImages);

    function filterSlectedIds(){
            const selectedUuids = Object.keys(selected[selectedGallery] || {}).filter(
                (imageUuid) => selected[selectedGallery][imageUuid]
            );
        
            const selectedImageIds = images.filter(image => selectedUuids.includes(image.uuid))
            .map(image => image.id);

        return selectedImageIds;
    }

    try {
        const token = localStorage.getItem('authSelToken');
        const ids = filterSlectedIds();
        console.log("ids " + filterSlectedIds())
        const payload = {"selected_photos" : ids}

        const response = await axios.post(
            `${BASE_URL}/submit/${selectedGallery}/`,payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log("Server Response:", response.data);

        // alert("Images submitted successfully!");

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Images submitted successfully!',
          confirmButtonText: 'OK',
      });

    } catch (error) {
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
                        className={`albumnavlink ${selectedGallery === gallery.uuid ? 'active' : ''}`}
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
                                onClick={() => handleImage(index)}
                                style={{ cursor: 'pointer' }}
                            />
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
                                        onChange={() => handleselected(selectedGallery, image.uuid)}
                                    />
                                    <label htmlFor={`checkbox-${image.uuid}`}></label>
                                </div>
                            </div>
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
