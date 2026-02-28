/**
 * ResultBanner — Final Dominant Bias Reveal
 * See AGENT.md §8 — ResultBanner.jsx
 * See AGENT.md §12 — Demo Script step 5 (final reveal)
 *
 * Displays the dominant bias with its percentage and color.
 * Shows the Rationalist's summary and optional bias-corrected recommendation.
 *
 * Closing line from demo: "You didn't change your situation —
 * you just saw which fear was running the show."
 */

import { motion } from "framer-motion";
import { AGENT_COLORS, AGENT_DISPLAY_NAMES } from "../utils/agentColors";

/**
 * @param {Object} props
 * @param {string} props.dominantBias — Name of the dominant bias agent
 * @param {number} props.dominancePercentage — 0-100 dominance score
 * @param {string} props.rationalistSummary — One-sentence synthesis from the Rationalist
 * @param {string|null} props.biasCorrectedRecommendation — Optional recalculated recommendation
 */
export default function ResultBanner({
  dominantBias = "",
  dominancePercentage = 0,
  rationalistSummary = "",
  biasCorrectedRecommendation = null,
}) {
  const color = AGENT_COLORS[dominantBias] || "#E2E8F0";
  const displayName = AGENT_DISPLAY_NAMES[dominantBias] || dominantBias;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-6 bg-mirror-bg/90 backdrop-blur border-t border-white/10"
    >
      {/* TODO: Render dominant bias name with color and percentage */}
      {/* TODO: Render rationalist summary */}
      {/* TODO: Render bias-corrected recommendation if available */}
      {/* TODO: Animate entrance with Framer Motion */}
    </motion.div>
  );
}
