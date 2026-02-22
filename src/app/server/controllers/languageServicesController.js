import LanguageService from '../models/LanguageServices.js';

// Get all active languages and services
export const getAllLanguagesServices = async () => {
  try {
    const items = await LanguageService.find({ isActive: true }).sort('order');
    return items;
  } catch (error) {
    throw new Error(`Failed to fetch languages and services: ${error.message}`);
  }
};

// Get languages only
export const getLanguages = async () => {
  try {
    const languages = await LanguageService.find({ type: 'language', isActive: true }).sort('order');
    return languages;
  } catch (error) {
    throw new Error(`Failed to fetch languages: ${error.message}`);
  }
};

// Get services only
export const getServices = async () => {
  try {
    const services = await LanguageService.find({ type: 'service', isActive: true }).sort('order');
    return services;
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
};

// Create a new language or service
export const createLanguageService = async (data) => {
  try {
    const newItem = new LanguageService(data);
    await newItem.save();
    return newItem;
  } catch (error) {
    throw new Error(`Failed to create language/service: ${error.message}`);
  }
};

// Update a language or service
export const updateLanguageService = async (id, data) => {
  try {
    const updatedItem = await LanguageService.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return updatedItem;
  } catch (error) {
    throw new Error(`Failed to update language/service: ${error.message}`);
  }
};

// Delete a language or service
export const deleteLanguageService = async (id) => {
  try {
    const deletedItem = await LanguageService.findByIdAndDelete(id);
    return deletedItem;
  } catch (error) {
    throw new Error(`Failed to delete language/service: ${error.message}`);
  }
};

// Reorder languages and services
export const reorderLanguagesServices = async (items) => {
  try {
    for (let i = 0; i < items.length; i++) {
      await LanguageService.findByIdAndUpdate(items[i]._id, { order: i });
    }
    return await LanguageService.find({ isActive: true }).sort('order');
  } catch (error) {
    throw new Error(`Failed to reorder items: ${error.message}`);
  }
};
