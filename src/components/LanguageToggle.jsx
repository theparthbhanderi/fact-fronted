import { motion } from "framer-motion";
import "./LanguageToggle.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function LanguageToggle({ activeLang, onSelect, disabled }) {
  return (
    <div className={`lang-toggle-container ${disabled ? "disabled" : ""}`}>
      {LANGUAGES.map((lang) => {
        const isActive = activeLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => !disabled && onSelect(lang.code)}
            className={`lang-btn ${isActive ? "active" : ""}`}
            disabled={disabled}
            aria-pressed={isActive}
            title={`Translate to ${lang.label}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-lang-pill"
                className="lang-active-bg"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="lang-label">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
