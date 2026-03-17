import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResultCard from "./ResultCard";
import EvidenceList from "./EvidenceList";
import LanguageToggle from "./LanguageToggle";
import { translateText } from "../utils/translate";

import EvidenceStrengthBars from "./EvidenceStrengthBars";
import EvidenceConsensusChart from "./EvidenceConsensusChart";
import ConfidenceBreakdown from "./ConfidenceBreakdown";
import ReasoningPanel from "./ReasoningPanel";

import "./ClaimResultView.css";

/**
 * Wraps the ResultCard and EvidenceList to manage per-claim translation state.
 * Allows language toggling without re-querying the entire fact check, utilizing
 * a local translation cache for the explanation text using a free Google endpoint.
 */
export default function ClaimResultView({ result, evidenceLoading }) {
  // Cache for explanations per language
  const [translations, setTranslations] = useState({});
  const [activeLang, setActiveLang] = useState("en");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    // Reset when new result comes in
    setTranslations({});
    setActiveLang("en");
  }, [result]);

  const handleLanguageChange = async (langCode) => {
    setActiveLang(langCode);

    if (langCode === "en") {
      return;
    }

    if (translations[langCode]) {
      // CACHE HIT - instant switch
      return;
    }

    // CACHE MISS - translate the explanation text
    setTranslating(true);
    try {
      const translated = await translateText(result.explanation, langCode);
      setTranslations((prev) => ({
        ...prev,
        [langCode]: translated,
      }));
    } catch (err) {
      console.error("Translation failed:", err);
      // Fallback
      setActiveLang("en");
    } finally {
      setTranslating(false);
    }
  };

  const translatedExplanation = translations[activeLang];
  
  // Overlay the translated explanation onto the active data
  const activeData = {
    ...result,
    explanation: activeLang === "en" ? result.explanation : (translatedExplanation || result.explanation),
  };

  const evidence = activeData.evidence || [];
  const breakdown = activeData.confidence_breakdown || {};
  const MotionDiv = motion.div;

  // Consensus chart: backend does not currently return stance counts in the API.
  // Keep a neutral-only visualization that still renders safely (no extra messaging).
  const consensusCounts = { supporting: 0, contradicting: 0, neutral: Math.max(1, evidence.length || 1) };

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
        isTranslating={translating}
      />

      {/* AI reasoning (quick access) */}
      <div className="viz-section">
        <ReasoningPanel result={activeData} defaultOpen />
      </div>

      {/* Evidence Sources (existing list) */}
      <AnimatePresence mode="wait">
        <MotionDiv
           key={activeLang}
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.98 }}
           transition={{ duration: 0.2 }}
        >
          <EvidenceList
            evidence={evidence}
            loading={evidenceLoading}
          />
        </MotionDiv>
      </AnimatePresence>

      {/* Evidence strength + consensus */}
      <div className="viz-section">
        <div className="viz-grid">
          <EvidenceStrengthBars evidence={evidence} />
          <EvidenceConsensusChart
            supporting={consensusCounts.supporting}
            contradicting={consensusCounts.contradicting}
            neutral={consensusCounts.neutral}
          />
        </div>
      </div>

      {/* Confidence Breakdown */}
      <div className="viz-section">
        <ConfidenceBreakdown confidence={activeData.confidence} breakdown={breakdown} />
      </div>
    </div>
  );
}
