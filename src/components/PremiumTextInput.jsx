import { useId } from "react";
import { motion } from "framer-motion";
import "./PremiumTextInput.css";

export default function PremiumTextInput({
  id,
  icon: Icon,
  inline = false,
  className = "",
  actionIcon: ActionIcon,
  actionLabel,
  actionAriaLabel,
  actionType = "button",
  actionDisabled = false,
  onAction,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  autoComplete = "off",
  inputMode,
  pattern,
  title,
  onKeyDown,
  error,
  ariaLabel,
}) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <motion.div
      className={`pti-shell ${inline ? "is-inline" : ""} ${className}`.trim()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className={`pti-group ${error ? "is-error" : ""} ${disabled ? "is-disabled" : ""}`}>
        <div className="pti-field">
          {Icon ? <Icon size={18} className="pti-icon" aria-hidden="true" /> : null}
          <input
            id={inputId}
            className="pti-input"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            pattern={pattern}
            title={title}
            onKeyDown={onKeyDown}
            aria-label={ariaLabel}
          />
        </div>

        {ActionIcon ? (
          <button
            type={actionType}
            className="pti-action"
            onClick={onAction}
            disabled={disabled || actionDisabled}
            aria-label={actionAriaLabel || actionLabel || "Action"}
            title={actionLabel || ""}
          >
            <ActionIcon size={18} aria-hidden="true" />
            {actionLabel ? <span className="pti-actionText">{actionLabel}</span> : null}
          </button>
        ) : null}
      </div>
      {error ? <div className="pti-error">{error}</div> : null}
    </motion.div>
  );
}

