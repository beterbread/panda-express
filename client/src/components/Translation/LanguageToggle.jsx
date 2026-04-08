import React from "react";
import { useTranslation } from "./TranslationWrapper";

export const LanguageToggle = () => {
  const { currentLanguage, toggleLanguage } = useTranslation();

  return (
    <button className="translate-button" onClick={toggleLanguage}>
      {currentLanguage === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    </button>
  );
};