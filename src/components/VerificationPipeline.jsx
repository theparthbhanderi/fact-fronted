import { motion } from "framer-motion";
import { CheckCircle2, CircleDot } from "lucide-react";
import "./VerificationPipeline.css";

const STEPS = [
  "Claim Input",
  "Claim Extraction",
  "Evidence Retrieval",
  "Evidence Analysis",
  "Consensus Detection",
  "Fact Verification",
  "Final Verdict",
];

export default function VerificationPipeline({ completedSteps = STEPS.length }) {
  const clampedCompleted = Math.max(0, Math.min(STEPS.length, completedSteps));
  const MotionDiv = motion.div;

  return (
    <div className="vp-root" aria-label="AI verification process pipeline">
      <div className="vp-flow">
        {STEPS.map((label, idx) => {
          const isDone = idx < clampedCompleted;
          return (
            <MotionDiv
              key={label}
              className={`vp-card ${isDone ? "vp-card--done" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.3 + idx * 0.2 }}
            >
              <div className="vp-icon">
                {isDone ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <CircleDot size={20} />
                )}
              </div>
              <div className="vp-label">{label}</div>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

