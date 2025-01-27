// import React, { useEffect, useState ,useRef} from 'react';
// import { NavLink } from 'react-router';
// import { Link } from 'react-router';
// import '../CSS/photogallery.css';
// import image1 from '../assets/indeximage.jpg';
// import download from '../assets/download.png';
// import nextArrow from '../assets/next.png';
// import previousArrow from '../assets/back.png';

// function Photogallery() {
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true) ;
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [openedImage, setOpenedImage] = useState(null);
//     const galleryRef=useRef(null)
//     const scrolltoGallery = () => {
//       galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };
    
//     // const [isFullscreen, setIsFullscreen] = useState(false);
  
//     // const toggleFullscreen = () => {
//     //   if (isFullscreen) {
//     //     handle.exit();
//     //   } else {
//     //     handle.enter();
//     //   }
//     //   setIsFullscreen(!isFullscreen);
//     // };
  
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
//                 console.error('Error fetching image data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchImages();
//     }, []);

//     const handleImage = (index) => {
//         setCurrentIndex(index);
//         setOpenedImage(images[index]?.src);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setOpenedImage(images[(currentIndex + 1) % images.length]?.src);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//         setOpenedImage(images[(currentIndex === 0 ? images.length - 1 : currentIndex - 1)]?.src);
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

//     return (
//       <div className="parallax-wrapper">
//       <div className="hero parallax-content">
//           <div
//               className="imagecontainer"
//               style={{
//                   backgroundImage: `url(${image1})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   backgroundRepeat: 'no-repeat',
//                   height: '85vh',
//                   position: 'relative', 
//               }}
//           >
//               <div className='button-container'>
//                 <Link onClick={scrolltoGallery}> <button>OPEN GALLERY</button></Link> 
               
//               </div>
//           </div>
//       </div>
 
//             <div className="main-content">
//                 <div className="hero__title">
//                     <h1>STEFFY & NOBIN</h1>
//                 </div>
               

//                 <div className="navbarmain"  ref={galleryRef}>
                  
//                     <NavLink to="#" className="nav-item" onClick={(e) => e.preventDefault()}>Haldi</NavLink>
//                     <NavLink to="#" className="nav-item" onClick={(e) => e.preventDefault()}>Wedding</NavLink>
//                     <NavLink to="#" className="nav-item" onClick={(e) => e.preventDefault()}>Reception</NavLink>
//                 </div>

//                 {loading ? (
//                     <div className="loading">Loading images...</div>
//                 ) : (
                  
//                     <div className="gallery-container">
//                         {images.map((image, index) => (
//                             <div key={image.id} className="gallery-item">
//                                 <img
//                                     src={image.src}
//                                     alt={image.alt}
//                                     className="img-fluid"
//                                     onLoad={(e) => (e.target.style.opacity = 1)}
//                                     style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
//                                     onClick={() => handleImage(index)}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {openedImage && (
//                     <div className="openmodal" onClick={closeModal}>
//                         <div className="openmodal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="Gdownload-btn" onClick={handleDownload}>
//                                 <img src={download} alt="Download" />
//                             </button>
//                             <button className="Gclose-btn" onClick={closeModal}>
//                                 &times;
//                             </button>
               
//                             <button className="Gprev-btn" onClick={handlePrevious}>
//                                 <img src={previousArrow} alt="Previous" />
//                             </button>
//                             <img src={openedImage} alt="Full Image" className="openmodal-image" />
//                             <button className="Gnext-btn" onClick={handleNext}>
//                                 <img src={nextArrow} alt="Next" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// export default Photogallery;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink } from 'react-router';
import axios from "axios";
import logo from '../assets/logo.png'
import "../CSS/photogallery.css";
import download from "../assets/download.png";
import nextArrow from "../assets/next.png";
import previousArrow from "../assets/back.png";

const BASE_URL = "https://web.snoxpro.com/public/api/v1/gallery";

function Photogallery() {
  const { event_uuid } = useParams();
  
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [openedImage, setOpenedImage] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [error, setError] = useState("");
  const galleryRef = useRef(null);

  const scrolltoGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${BASE_URL}/${event_uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        setEventDetails(response.data.event);
        setGalleries(response.data.galleries);
        setGalleryTitle(response.data.event.title);
        
      
        if (response.data.galleries.length > 0) {
          const firstGalleryUuid = response.data.galleries[0].uuid;
          setSelectedGallery(firstGalleryUuid);
          const imagesResponse = await axios.get(
            `${BASE_URL}/images/${firstGalleryUuid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setImages(imagesResponse.data.results || []);
        }
          
      } catch (err) {
        setError("Failed to load event details.");
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [event_uuid]);


  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }
  
  const handleGalleryClick = async (galleryUuid) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/images/${galleryUuid}`, {
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
    const link = document.createElement("a");
    link.href = openedImage;
    link.download = `Image_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="parallax-wrapper">
    
      <div className="hero parallax-content">
        <div
          className="imagecontainer"
          style={{
            backgroundImage: `url(${eventDetails.image})`,
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
        <img className="logostylePG" src={logo} alt="Logo" />
      </div>
        </div>

        {loading ? (
          <div className="loading">Loading images...</div>
        ) : (
          <div className="navbarmain" ref={galleryRef}>
            {galleries.length > 0 ? (
              galleries.map((gallery) => (
                <div key={gallery.uuid}>
                  <NavLink 
                    className={`nav-item ${selectedGallery === gallery.uuid ? "selected" : ""}`}
                    onClick={() => handleGalleryClick(gallery.uuid)}
                  >
                    {gallery.name}
                  </NavLink>
                </div>
              ))
            ) : (
              <p>No galleries found for this event.</p>
            )}
          </div>
        )}

        <div className="gallery-container">
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
              </div>
            ))
          ) : (
            <p>No images available for this gallery.</p>
          )}
        </div>

        {openedImage && (
          <div className="openmodal" onClick={closeModal}>
            <div
              className="openmodal-content"
              onClick={(e) => e.stopPropagation()}
            >
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
              />
              <button className="Gnext-btn" onClick={handleNext}>
                <img src={nextArrow} alt="Next" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Photogallery;
