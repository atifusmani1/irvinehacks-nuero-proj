/**
 * InputScreen — Dilemma Input UI
 * See AGENT.md §8 — Frontend Component Map
 *
 * Features:
 *   - Large textarea for the user's dilemma
 *   - Keyword highlighting (e.g., "terrified", "savings", "wasting")
 *   - "Scanning..." pulse animation on submit
 *
 * See AGENT.md §12 — Demo Script step 1 for expected behavior.
 */

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {(dilemma: string) => void} props.onSubmit — Called with the dilemma text
 */
export default function InputScreen({ onSubmit }) {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Keywords that trigger visual highlights — see AGENT.md §12 step 1
  const HIGHLIGHT_KEYWORDS = [
    "terrified", "scared", "afraid", "fear",
    "savings", "money", "salary", "income",
    "wasting", "waste", "stuck", "trapped",
    "stable", "safe", "security", "risk",
    "dream", "passion", "love", "hate",
  ];

  const handleSubmit = () => {
    if (!text.trim()) return;
    setIsScanning(true);
    // TODO: Show "Scanning..." pulse animation
    // TODO: After brief delay, call onSubmit(text)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* TODO: Render title / tagline */}
      {/* TODO: Render textarea with keyword highlight overlay */}
      {/* TODO: Render submit button */}
      {/* TODO: Render "Scanning..." pulse when isScanning is true */}
    </div>
  );
}
