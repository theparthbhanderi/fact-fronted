import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResultCard from "./ResultCard";
import EvidenceList from "./EvidenceList";
import LanguageToggle from "./LanguageToggle";
import { translateResult } from "../services/api";

import "./ClaimResultView.css";

/**
 * Wraps the ResultCard and EvidenceList to manage per-claim translation state.
 * Allows language toggling without re-querying the entire fact check, utilizing
 * a local translation cache.
 */
export default function ClaimResultView({ result, evidenceLoading }) {
  // Original english response cache
  const [translations, setTranslations] = useState({
    en: result,
  });
  
  const [activeLang, setActiveLang] = useState("en");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    // If a new 'result' comes in from the parent (e.g. user searched a new claim),
    // we must update our translation cache's 'en' base and reset active language
    // to prevent showing old stale results.
    setTranslations({ en: result });
    setActiveLang("en");
  }, [result]);

  const handleLanguageChange = async (langCode) => {
    if (langCode === activeLang) return;

    if (translations[langCode]) {
      // CACHE HIT - instant switch
      setActiveLang(langCode);
      return;
    }

    // CACHE MISS - ping backend translation route
    setTranslating(true);
    try {
      const translatedResult = await translateResult(result, langCode);
      setTranslations((prev) => ({
        ...prev,
        [langCode]: translatedResult,
      }));
      setActiveLang(langCode);
    } catch (err) {
      console.error("Translation failed:", err);
      // Fallback to english or show a toast if available
      setActiveLang("en");
    } finally {
      setTranslating(false);
    }
  };

  const activeData = translations[activeLang] || result;

  return (
    <div className="claim-result-view">
      {/* 
        Pass a header action slot to the ResultCard so it can mount 
        the LanguageToggle in the top right.
      */}
      <ResultCard 
        result={activeData} 
        headerAction={
          <LanguageToggle
            activeLang={activeLang}
            onSelect={handleLanguageChange}
            disabled={translating || evidenceLoading}
          />
        }
      />
      
      {/* Evidence List with animation for translation changes */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeLang}
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.98 }}
           transition={{ duration: 0.2 }}
        >
          <EvidenceList
            evidence={activeData.evidence || []}
            loading={evidenceLoading}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
