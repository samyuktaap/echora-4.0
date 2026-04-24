// Translation test utility to debug language issues
import { getTranslatedContent, getTranslatedSkill, getTranslatedUrgency } from '../data/contentTranslations';

export const testTranslations = (language) => {
  console.log(`Testing translations for language: ${language}`);
  
  // Test task translation
  const taskTranslation = getTranslatedContent(language, 'tasks', 1, 'ngoName');
  console.log('Task NGO Name:', taskTranslation);
  
  // Test skill translation
  const skillTranslation = getTranslatedSkill(language, 'Teaching');
  console.log('Skill Translation:', skillTranslation);
  
  // Test urgency translation
  const urgencyTranslation = getTranslatedUrgency(language, 'High');
  console.log('Urgency Translation:', urgencyTranslation);
  
  return {
    taskTranslation,
    skillTranslation,
    urgencyTranslation
  };
};
