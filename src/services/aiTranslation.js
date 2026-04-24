// AI Translation Service for Dynamic Content
// Uses MyMemory API as the translation model to translate new/dynamic content on the fly.

const translationCache = {};
const pendingRequests = new Set();
let notifyUpdate = null;

// Register a callback to notify React when a new translation arrives
export const setTranslationNotifier = (fn) => {
  notifyUpdate = fn;
};

export const getAITranslation = (text, targetLang) => {
  if (!text || typeof text !== 'string') return text;
  if (targetLang === 'en') return text;
  
  const cacheKey = `${targetLang}:${text}`;
  
  // 1. Check if we already have it in cache
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  // 2. If not, and we aren't already fetching it, start the AI translation request
  if (!pendingRequests.has(cacheKey)) {
    pendingRequests.add(cacheKey);
    
    // We use MyMemory API as our free, accessible translation model
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.responseData && data.responseData.translatedText) {
          let translated = data.responseData.translatedText;
          // MyMemory sometimes leaves a 'MYMEMORY WARNING', we ignore those
          if (!translated.includes('MYMEMORY')) {
            translationCache[cacheKey] = translated;
            // Trigger React re-render so components instantly show the new translation
            if (notifyUpdate) notifyUpdate(); 
          }
        }
      })
      .catch(err => {
        console.error('AI Translation model error:', err);
      })
      .finally(() => {
        pendingRequests.delete(cacheKey);
      });
  }
  
  // 3. Return the original English text synchronously while the AI model translates in the background.
  // Once the model finishes, it will trigger a re-render and return the cached translation.
  return text;
};
