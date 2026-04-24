# ECHORA Multilingual Translation System Guide

## Overview
The ECHORA app now supports 4 languages: English, Hindi, Tamil, and Kannada. The translation system is built with React Context and provides a simple `t()` function to translate any UI text.

## Files Structure

```
src/
├── context/
│   └── LanguageContext.jsx     # Translation context & provider
├── data/
│   └── translations.js         # All translation strings
├── components/
│   └── Navbar.jsx             # Language switcher (already integrated)
└── pages/
    └── TaskBoardExample.jsx    # Example component with translations
```

## How to Use the Translation System

### 1. Import the useLanguage Hook
```jsx
import { useLanguage } from '../context/LanguageContext';
```

### 2. Get the Translation Function
```jsx
const { t, language } = useLanguage();
```

### 3. Use the t() Function in Your JSX
```jsx
// Instead of hardcoded text:
<h1>Volunteer Opportunities</h1>

// Use the translation function:
<h1>{t('volunteerOpportunities')}</h1>
```

### 4. Complete Component Example
```jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('volunteerOpportunities')}</h1>
      <p>{t('browseNGORequests')}</p>
      <button>{t('applyNowBtn')}</button>
      
      {/* Conditional translations */}
      <p>
        {language === 'en' ? 'Current language' : 'वर्तमान भाषा'}: {language}
      </p>
    </div>
  );
};

export default MyComponent;
```

## Available Translation Keys

### Common UI Elements
```jsx
t('loading')              // "Loading..." / "लोड हो रहा है..." / "ஏற்றப்படுகிறது..." / "ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
t('save')                 // "Save" / "सेव करें" / "சேமி" / "ಉಳಿಸಿ"
t('cancel')               // "Cancel" / "रद्द करें" / "ரத்துசெய்" / "ರದ್ದುಮಾಡಿ"
t('apply')                // "Apply" / "आवेदन करें" / "விண்ணப்பிக்கவும்" / "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ"
t('search')               // "Search" / "खोजें" / "தேடு" / "ಹುಡುಕಿ"
t('error')                // "Error" / "त्रुटि" / "பிழை" / "ದೋಷ"
t('success')              // "Success" / "सफल" / "வெற்றி" / "ಯಶಸ್ವಿ"
```

### Navigation
```jsx
t('navDashboard')         // "Dashboard" / "डैशबोर्ड" / "டாஷ்போர்டு" / "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
t('navTasks')             // "Task Board" / "कार्य बोर्ड" / "பணி பலகை" / "ಕಾರ್ಯ ಬೋರ್ಡ್"
t('navProfile')           // "My Profile" / "मेरा प्रोफाइल" / "என் சுயவிவரம்" / "ನನ್ನ ಪ್ರೊಫೈಲ್"
```

### Task Board
```jsx
t('volunteerOpportunities')     // "Volunteer Opportunities"
t('browseNGORequests')          // "Browse NGO requests and apply..."
t('yourSkillsLabel')           // "Your Skills:"
t('allCauses')                  // "All Causes"
t('sortBestMatch')              // "Sort: Best Match"
t('applyNowBtn')                // "Apply Now →"
t('appliedBtn')                 // "✓ Applied"
t('noOpportunitiesFound')       // "No opportunities found"
t('loadingOpportunities')       // "Loading opportunities..."
```

### Dashboard
```jsx
t('welcome')              // "Welcome," / "स्वागत है," / "வரவேற்று," / "ಸ್ವಾಗತ,"
t('tasksCompleted')       // "Tasks Completed" / "पूरे किए गए कार्य" / "முடிந்த பணிகள்" / "ಪೂರ್ಣಗೊಂಡ ಕಾರ್ಯಗಳು"
t('pointsEarned')         // "Points Earned" / "अर्जित अंक" / "பெற்ற புள்ளிகள்" / "ಗಳಿಸಿದ ಅಂಕಗಳು"
```

### NGO Dashboard
```jsx
t('ngoDashboard')               // "NGO Dashboard"
t('postedOpportunities')        // "Your posted opportunities & incoming applications"
t('postNewOpportunity')         // "+ Post New Opportunity"
t('autoSelectionMode')          // "🤖 Auto-Selection Mode"
t('runAutoSelectAllTasks')      // "Run Auto-Selection All Tasks"
t('approveLabel')               // "Approve" / "स्वीकृत करें" / "ஒப்புக்கொள்" / "ಅನುಮೋದಿಸಿ"
t('declineLabel')               // "Decline" / "अस्वीकार करें" / "மறு" / "ತಿರಸ್ಕರಿಸಿ"
```

## Language Switcher

The language switcher is already integrated in the navbar. Users can click the globe icon to see all available languages:

- 🇺🇸 English
- 🇮🇳 Hindi (हिन्दी)
- 🇱🇰 Tamil (தமிழ்)
- 🇮🇳 Kannada (ಕನ್ನಡ)

## Adding New Translations

### 1. Add to translations.js
```javascript
// In src/data/translations.js
export const translations = {
  en: {
    myNewKey: 'My new text',
  },
  hi: {
    myNewKey: 'मेरा नया पाठ',
  },
  ta: {
    myNewKey: 'எனது புதிய உரை',
  },
  kn: {
    myNewKey: 'ನನ್ನ ಹೊಸ ಪಠ್ಯ',
  }
};
```

### 2. Use in Components
```jsx
<p>{t('myNewKey')}</p>
```

## Dynamic Content Translation

For dynamic content (like NGO names, task descriptions, etc.), use the content translation system:

```jsx
import { getTranslatedContent } from '../data/contentTranslations';

// Translate NGO name
const translatedNGOName = getTranslatedContent('ngo', ngo.id, 'name', language);

// Translate task description
const translatedDescription = getTranslatedContent('tasks', task.id, 'description', language);
```

## Best Practices

### 1. Always Use Translation Keys
```jsx
// ❌ Bad
<h1>Welcome</h1>

// ✅ Good
<h1>{t('welcome')}</h1>
```

### 2. Use Descriptive Key Names
```jsx
// ❌ Bad
t('text1')
t('buttonText')

// ✅ Good
t('welcomeMessage')
t('applyNowBtn')
```

### 3. Handle Missing Translations Gracefully
```jsx
// The t() function automatically falls back to the key if translation is missing
<p>{t('someNewKey')}</p> // Shows "someNewKey" if not translated
```

### 4. Keep Translations Consistent
```jsx
// Use the same key for the same concept across the app
t('loading') // Use this everywhere for loading text
```

## Testing Different Languages

1. Open the app
2. Click the globe icon in the navbar
3. Select a different language
4. Verify all text is translated

## Current Status

✅ **LanguageContext** - Complete with localStorage persistence  
✅ **Translation Files** - Complete for all 4 languages  
✅ **Navbar Integration** - Language switcher working  
✅ **Main.jsx Setup** - App wrapped in LanguageProvider  
✅ **Example Component** - TaskBoardExample.jsx shows full integration  

## Next Steps

To complete the translation system:

1. **Update All Components**: Replace hardcoded strings with `t()` calls
2. **Add Missing Keys**: Add any new UI text to all 4 languages
3. **Test Thoroughly**: Test each page in all 4 languages
4. **Dynamic Content**: Set up content translation for database content

## Troubleshooting

### Translation Not Working
- Ensure component imports `useLanguage`
- Check that the key exists in translations.js
- Verify the component is wrapped in LanguageProvider

### Language Not Persisting
- Check that LanguageProvider is in main.jsx
- Verify localStorage is enabled in browser

### Missing Translation
- Add the missing key to all 4 languages in translations.js
- Use descriptive key names for future maintainability
