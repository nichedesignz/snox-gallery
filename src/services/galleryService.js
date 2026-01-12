import axios from 'axios';
import CONFIG from '../config';

const API_BASE_URL = CONFIG.API_BASE_URL;

/**
 * Gallery Service - Handles all API calls related to galleries
 */
class GalleryService {
  /**
   * Fetch event data and galleries for regular gallery view
   * @param {string} eventId - The event UUID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Event data with galleries
   */
  static async fetchEventData(eventId, token) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}public/api/v1/gallery/${eventId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.result) {
        throw new Error("Invalid response format");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching event data:", error);
      throw error;
    }
  }

  /**
   * Fetch gallery images with pagination for regular gallery view
   * @param {string} galleryUuid - The gallery UUID
   * @param {string} token - Authentication token
   * @param {number} offset - Pagination offset
   * @param {number} limit - Pagination limit
   * @returns {Promise<Array>} Array of images
   */
  static async fetchGalleryImages(galleryUuid, token, offset = 0, limit = 20) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}public/api/v1/gallery/images/${galleryUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { offset, limit },
        }
      );

      return response.data.data.results || [];
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      throw error;
    }
  }

  /**
   * Fetch event data and galleries for selection gallery
   * @param {string} eventId - The event UUID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Event data with galleries and selection info
   */
  static async fetchSelectionEventData(eventId, token) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}public/api/v1/selection/${eventId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.result) {
        throw new Error("Invalid response format");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching selection event data:", error);
      throw error;
    }
  }

  /**
   * Fetch all gallery images for selection (no pagination)
   * @param {string} galleryUuid - The gallery UUID
   * @param {string} token - Authentication token
   * @param {number} limit - Items per request
   * @returns {Promise<Array>} Array of all images
   */
  static async fetchAllSelectionImages(galleryUuid, token, limit = 50) {
    try {
      let allImages = [];
      let currentOffset = 0;
      let totalCount = null;

      do {
        const response = await axios.get(
          `${API_BASE_URL}public/api/v1/selection/images/${galleryUuid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { offset: currentOffset, limit },
          }
        );

        if (totalCount === null) {
          totalCount = response.data.data.count;
        }

        const newImages = response.data.data.results || [];
        allImages = [...allImages, ...newImages];
        currentOffset += limit;
      } while (currentOffset < totalCount);

      return allImages;
    } catch (error) {
      console.error("Error fetching selection images:", error);
      throw error;
    }
  }

  /**
   * Submit selected images
   * @param {string} galleryUuid - The gallery UUID
   * @param {string} token - Authentication token
   * @param {Array<string>} selectedImageIds - Array of selected image IDs
   * @returns {Promise<Object>} Submission response
   */
  static async submitSelectedImages(galleryUuid, token, selectedImageIds) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}public/api/v1/selection/submit/${galleryUuid}/`,
        { selected_photos: selectedImageIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting selected images:", error);
      throw error;
    }
  }

  /**
   * Download an image via proxy
   * @param {string} imageUrl - The image URL to download
   * @returns {string} Proxy download URL
   */
  static getDownloadUrl(imageUrl) {
    return `${API_BASE_URL}proxy/download/?url=${encodeURIComponent(imageUrl)}`;
  }
}

export default GalleryService;
