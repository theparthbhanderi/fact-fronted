import { motion } from "framer-motion";
import "./SegmentedControl.css";

/**
 * Apple-style segmented control.
 * - items: [{ value, label, disabled? }]
 * - value: active value
 * - onChange: (value) => void
 */
export default function SegmentedControl({
  items = [],
  value,
  onChange,
  disabled = false,
  ariaLabel = "Segmented control",
  className = "",
  layoutId = "segmented-active-pill",
}) {
  const MotionDiv = motion.div;

  return (
    <div
      className={`sc-root ${disabled ? "sc-disabled" : ""} ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((it) => {
        const isActive = it.value === value;
        const isDisabled = disabled || Boolean(it.disabled);
        return (
          <button
            key={String(it.value)}
            type="button"
            className={`sc-seg ${isActive ? "sc-active" : ""}`}
            onClick={() => {
              if (isDisabled) return;
              onChange?.(it.value);
            }}
            disabled={isDisabled}
            aria-pressed={isActive}
            role="tab"
          >
            {isActive ? (
              <MotionDiv
                layoutId={layoutId}
                className="sc-activeBg"
                initial={false}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="sc-label">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

