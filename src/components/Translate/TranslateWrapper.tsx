"use client";
import { useState, useEffect } from "react";
import { translations, Locale } from "@/constants/translation";

// Custom event name for language changes
const LANGUAGE_CHANGE_EVENT = "languageChange";

export function useTranslation() {
  // Initialize from localStorage if available
  const getInitialLocale = (): Locale => {
    if (typeof window !== "undefined") {
      const storedLanguageLabel = localStorage.getItem("languageLabel");
      if (storedLanguageLabel === "EN" || storedLanguageLabel === "AR") {
        return storedLanguageLabel;
      }
    }
    return "EN";
  };

  const [locale, setLocale] = useState<Locale>(getInitialLocale());

  // Sync with language changes via custom event
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLanguageChange = (event: CustomEvent<Locale>) => {
        setLocale(event.detail);
      };

      window.addEventListener(LANGUAGE_CHANGE_EVENT as any, handleLanguageChange as EventListener);

      return () => {
        window.removeEventListener(LANGUAGE_CHANGE_EVENT as any, handleLanguageChange as EventListener);
      };
    }
  }, []);

  const t = translations[locale];

  // ✅ Allow direct setting (for your handleLanguageSelect)
  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("languageLabel", newLocale);
      // Dispatch custom event to notify all components
      window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLocale }));
    }
  };

  // ✅ Return both direct setter & toggle
  return { t, locale, changeLanguage };
}
