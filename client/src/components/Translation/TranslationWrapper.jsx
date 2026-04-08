import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// Create a context for the translation
const TranslationContext = createContext();

// Translation provider component
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  // Function to toggle between languages
  const toggleLanguage = () => {
    console.log("toggleLanguage called");
    setCurrentLanguage((prev) => {
      const newLanguage = prev === "en" ? "es" : "en";
      console.log("Language changed to:", newLanguage);
      return newLanguage;
    });
  };

  // Cache translations to avoid unnecessary API calls
  const translationCache = useRef({});

  // Function to translate text using MyMemory API
  const translateText = async (text, targetLang) => {
    try {
      const cacheKey = `${text}||${targetLang}`;
      if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
      }

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      const translated = data.responseData.translatedText;
      translationCache[cacheKey] = translated;
      return translated;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Function to update translations when language changes
  useEffect(() => {
    console.log("Current language is:", currentLanguage);
    const updateTranslations = async () => {
      if (currentLanguage === "en") {
        setTranslations({}); // Reset translations for English
        return;
      }

      // Get all texts that need translation from the cache
      const textsToTranslate = Object.keys(translationCache);
      const newTranslations = {};

      for (const text of textsToTranslate) {
        const translated = await translateText(text, currentLanguage);
        newTranslations[text] = translated;
      }

      setTranslations(newTranslations);
    };

    updateTranslations();
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        toggleLanguage,
        translate: async (text) => {
          if (currentLanguage === "en") return text;
          if (translations[text]) return translations[text];
          const translated = await translateText(text, currentLanguage);
          setTranslations((prev) => ({ ...prev, [text]: translated }));
          return translated;
        },
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

// Translation wrapper component
export const Translate = ({ children }) => {
  const { translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    const updateTranslation = async () => {
      const translated = await translate(children);
      setTranslatedText(translated);
    };
    updateTranslation();
  }, [children, translate]);

  return <>{translatedText}</>;
};