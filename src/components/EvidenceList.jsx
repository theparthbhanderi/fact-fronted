import { motion } from "framer-motion";
import "./EvidenceList.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function EvidenceList({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="evidence-list">
      <h3 className="evidence-title">Evidence Sources</h3>
      <motion.div 
        className="evidence-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {evidence.slice(0, 3).map((item, i) => (
          <motion.a
            key={i}
            variants={itemAnim}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="evidence-card"
          >
            <span className="evidence-index">{i + 1}</span>
            <div className="evidence-content">
              <h4 className="evidence-headline">{item.title}</h4>
              <span className="evidence-source">{item.source}</span>
            </div>
            <span className="evidence-arrow">→</span>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
