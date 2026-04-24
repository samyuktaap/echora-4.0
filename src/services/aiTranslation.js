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
  
  // 1. Check memory cache
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // 1.5 Check persistent localStorage cache for instant zero-lag loading
  try {
    const saved = localStorage.getItem(`echora_ai_trans_${targetLang}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[text]) {
        translationCache[cacheKey] = parsed[text];
        return parsed[text];
      }
    }
  } catch(e) {}

  // 2. Fetch from ultra-fast Google Translate AI model
  if (!pendingRequests.has(cacheKey)) {
    pendingRequests.add(cacheKey);
    
    // Use Google Translate's free backend API (no limits, <100ms response)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          let translated = data[0][0][0];
          translationCache[cacheKey] = translated;
          
          // Save to localStorage for zero-lag future reloads
          try {
            const saved = localStorage.getItem(`echora_ai_trans_${targetLang}`);
            const parsed = saved ? JSON.parse(saved) : {};
            parsed[text] = translated;
            localStorage.setItem(`echora_ai_trans_${targetLang}`, JSON.stringify(parsed));
          } catch(e) {}

          // Trigger React re-render
          if (notifyUpdate) notifyUpdate(); 
        }
      })
      .catch(err => console.error('AI Translation error:', err))
      .finally(() => pendingRequests.delete(cacheKey));
  }
  
  // 3. Return the original English text synchronously while the AI model translates in the background.
  // Once the model finishes, it will trigger a re-render and return the cached translation.
  return text;
};
