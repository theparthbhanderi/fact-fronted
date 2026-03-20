import SegmentedControl from "./SegmentedControl";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function LanguageToggle({ activeLang, onSelect, disabled }) {
  return (
    <SegmentedControl
      ariaLabel="Language selector"
      className="language-switcher"
      items={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
      value={activeLang}
      onChange={onSelect}
      disabled={disabled}
      layoutId="seg-lang-active"
    />
  );
}
