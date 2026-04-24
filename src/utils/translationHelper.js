// Comprehensive translation helper for all content
import { CONTENT_TRANSLATIONS } from '../data/contentTranslations';
import { getAITranslation } from '../services/aiTranslation';

// Create a mapping system for dynamic content translation
export const createContentMap = (data, type) => {
  const map = {};
  data.forEach(item => {
    // Create a key based on the original English content
    const key = `${type}_${item.id}`;
    map[key] = item;
  });
  return map;
};

// Get translated content with smart fallback
export const getSmartTranslation = (language, originalContent, type, id, field) => {
  try {
    // If not English, try to get translated content
    if (language !== 'en') {
      const translations = CONTENT_TRANSLATIONS[language];
      if (translations && translations[type] && translations[type][id]) {
        const translated = translations[type][id][field];
        if (translated && translated !== originalContent) {
          return translated;
        }
      }
      
      // Fallback: Use dynamic AI model for any new NGO posts/feedback
      return getAITranslation(originalContent, language);
    }
    
    // Return original content if English
    return originalContent;
  } catch (error) {
    console.error('Translation error:', error);
    return originalContent;
  }
};

// Translate all fields of an object
export const translateObject = (obj, language, type, id) => {
  const translated = { ...obj };
  
  if (obj.ngo_name) {
    translated.ngo_name = getSmartTranslation(language, obj.ngo_name, type, id, 'ngoName');
  } else if (obj.ngoName) {
    translated.ngoName = getSmartTranslation(language, obj.ngoName, type, id, 'ngoName');
  }
  
  if (obj.title) {
    translated.title = getSmartTranslation(language, obj.title, type, id, 'taskDescription');
  }
  
  if (obj.description) {
    translated.description = getSmartTranslation(language, obj.description, type, id, 'taskDescription');
  } else if (obj.taskDescription) {
    translated.taskDescription = getSmartTranslation(language, obj.taskDescription, type, id, 'taskDescription');
  }
  
  if (obj.name) {
    translated.name = getSmartTranslation(language, obj.name, type, id, 'name');
  }
  
  // Handle states and locations
  if (obj.state) {
    translated.state = getSmartTranslation(language, obj.state, type, id, 'state');
  }
  if (obj.location) {
    translated.location = getSmartTranslation(language, obj.location, type, id, 'location');
  }
  
  return translated;
};

// Translate array of objects
export const translateArray = (array, language, type) => {
  return array.map(item => translateObject(item, language, type, item.id));
};
