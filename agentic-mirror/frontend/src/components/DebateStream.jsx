/**
 * DebateStream — Scrolling Debate Dialogue Panel
 * See AGENT.md §8 — CenterPanel > DebateStream
 *
 * Displays the real-time debate between bias agents as a scrolling chat log.
 * Each agent's text is color-coded per AGENT.md §11.
 * Auto-scrolls to the latest message as SSE events arrive.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENT_COLORS, AGENT_DISPLAY_NAMES } from "../utils/agentColors";

/**
 * @param {Object} props
 * @param {Array<{round: number, dialogue: Array<{agent: string, text: string}>}>} props.rounds
 */
export default function DebateStream({ rounds = [] }) {
  const scrollRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rounds]);

  return (
    <div ref={scrollRef} className="p-4 overflow-y-auto h-full">
      {/* TODO: Map over rounds → dialogue entries */}
      {/* TODO: Render each agent's text with their color */}
      {/* TODO: Show round separators (e.g., "── Round 2 ──") */}
      {/* TODO: Animate new messages in with Framer Motion */}
      {rounds.length === 0 && (
        <p className="text-white/40 text-sm italic">
          Waiting for debate to begin...
        </p>
      )}
    </div>
  );
}
