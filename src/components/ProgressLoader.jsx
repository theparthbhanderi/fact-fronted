import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="progress-loader-container">
      <div className="progress-card">
        <div className="progress-header">
          <div className="spinner-ring small" />
          <h3>Verifying Fact</h3>
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
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="check-icon"
                    >
                      ✓
                    </motion.div>
                  ) : isActive ? (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="active-dot"
                    />
                  ) : (
                    <div className="pending-dot" />
                  )}
                </div>
                <span className="step-text">{step}...</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
