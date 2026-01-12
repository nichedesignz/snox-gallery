import { useState, useCallback } from 'react';
import axios from 'axios';
import CONFIG from '../config';

export const useGallery = (baseUrl, tokenKey) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [openedImage, setOpenedImage] = useState(null);

  const fetchGalleryImages = useCallback(async (galleryUuid, limit = 50) => {
    try {
      setLoading(true);
      const token = localStorage.getItem(tokenKey);
      let allImages = [];
      let currentOffset = 0;
      let totalCount = null;

      do {
        const response = await axios.get(`${baseUrl}/images/${galleryUuid}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { offset: currentOffset, limit },
        });

        if (totalCount === null) {
          totalCount = response.data.data.count;
        }

        allImages = [...allImages, ...response.data.data.results];
        currentOffset += limit;
      } while (currentOffset < totalCount);

      // Set the fetched images in state
      setImages(allImages);
      return allImages;
    } catch (err) {
      setError("Failed to load gallery images.");
      console.error("Error fetching gallery images:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [baseUrl, tokenKey]);

  const handleImageClick = useCallback((index) => {
    setCurrentIndex(index);
    setOpenedImage(images[index]?.large.url);
  }, [images]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setOpenedImage(images[nextIndex]?.large.url);
  }, [currentIndex, images]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setOpenedImage(images[prevIndex]?.large.url);
  }, [currentIndex, images]);

  const closeModal = useCallback(() => {
    setCurrentIndex(null);
    setOpenedImage(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (!openedImage) return;

    const link = document.createElement('a');
    link.href = `${CONFIG.API_BASE_URL}proxy/download/?url=${openedImage}`;
    link.download = `Image_${currentIndex + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [openedImage, currentIndex]);

  return {
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
  };
};

export default useGallery;
