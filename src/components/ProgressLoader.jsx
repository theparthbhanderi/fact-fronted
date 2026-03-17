import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Dot } from "lucide-react";
import "./ProgressLoader.css";

const DEFAULT_STEPS = [
  "Analyzing claim",
  "Searching trusted news sources",
  "Extracting evidence",
  "Cross-checking sources",
  "Generating reasoning",
  "Final verdict ready"
];

export default function ProgressLoader({ customSteps }) {
  const steps = customSteps || DEFAULT_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Total wait time is usually 10-15s. Distribute steps evenly.
    const intervalTime = 12000 / steps.length;
    
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [steps.length]);

  const total = Math.max(1, steps.length);
  const current = Math.min(currentStepIndex, total - 1);
  const progress = (current + 1) / total;

  return (
    <div className="progress-loader-container">
      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-headerLeft">
            <div className="spinner-ring small" />
            <div className="progress-headerText">
              <h3>Verifying</h3>
              <div className="progress-sub">
                Step {current + 1} of {total}: {steps[current]}
              </div>
            </div>
          </div>
          <div className="progress-pct">{Math.round(progress * 100)}%</div>
        </div>

        <div className="progress-bar" aria-hidden="true">
          <motion.div
            className="progress-barFill"
            initial={false}
            animate={{ width: `${Math.max(8, Math.round(progress * 100))}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          />
        </div>
        
        <div className="steps-list">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div 
                key={index} 
                className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isPending ? "pending" : ""}`}
              >
                <div className="step-indicator">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="step-icon step-icon--done"
                    >
                      <Check size={14} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div 
                      animate={{ opacity: [0.45, 1, 0.45] }} 
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="step-icon step-icon--active"
                    />
                  ) : (
                    <div className="step-icon step-icon--pending">
                      <Dot size={18} />
                    </div>
                  )}
                </div>
                <span className="step-text">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
