// Language Services API Helper
import { uploadImageToCloudinary } from '@/app/utils/galleryApi';

const API_BASE = '/api/language-services';

/**
 * Fetch all languages and services or filter by type
 * @param {string} type - 'language', 'service', or undefined for all
 * @returns {Promise<Array>}
 */
export async function getLanguagesServices(type = null) {
  try {
    const url = type ? `${API_BASE}?type=${type}` : API_BASE;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching languages and services:', error);
    throw error;
  }
}

/**
 * Fetch only languages
 * @returns {Promise<Array>}
 */
export async function getLanguages() {
  return getLanguagesServices('language');
}

/**
 * Fetch only services
 * @returns {Promise<Array>}
 */
export async function getServices() {
  return getLanguagesServices('service');
}

/**
 * Create a new language or service
 * @param {Object} data - { type, name, icon, description, image, order, isActive }
 * @returns {Promise<Object>}
 */
export async function createLanguageService(data) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating language/service:', error);
    throw error;
  }
}

/**
 * Update a language or service
 * @param {string} id - Item ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>}
 */
export async function updateLanguageService(id, data) {
  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating language/service:', error);
    throw error;
  }
}

/**
 * Delete a language or service
 * @param {string} id - Item ID
 * @returns {Promise<Object>}
 */
export async function deleteLanguageService(id) {
  try {
    const response = await fetch(API_BASE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error deleting language/service:', error);
    throw error;
  }
}

/**
 * Reorder languages and services
 * @param {Array} items - Array of items with _id
 * @returns {Promise<Array>}
 */
export async function reorderLanguagesServices(items) {
  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reorder', items }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reorder: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error reordering items:', error);
    throw error;
  }
}

/**
 * Upload language icon to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - URL of uploaded image
 */
export async function uploadLanguageIcon(file) {
  return uploadImageToCloudinary(file, 'azeez-portfolio/language-icons');
}
