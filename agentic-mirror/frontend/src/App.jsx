/**
 * Agentic Mirror — Root Application Component
 * See AGENT.md §8 — Frontend Component Map
 *
 * Flow: InputScreen → WorkspaceLayout (during debate) → ResultBanner (after debate)
 *
 * State management: React state only (AGENT.md §14 Rule 5 — no localStorage).
 */

import { useState } from "react";
import InputScreen from "./components/InputScreen";
import WorkspaceLayout from "./components/WorkspaceLayout";
import ResultBanner from "./components/ResultBanner";
import { useDebateStream } from "./hooks/useDebateStream";
import { useEmbeddings } from "./hooks/useEmbeddings";

export default function App() {
  // ── App-level state ──
  const [phase, setPhase] = useState("input"); // "input" | "debating" | "result"
  const [dilemma, setDilemma] = useState("");
  const [biasOverrides, setBiasOverrides] = useState({
    loss_aversion: 100,
    sunk_cost: 100,
    optimism_bias: 100,
    status_quo: 100,
  });

  // ── Hooks ──
  const {
    rounds,
    scores,
    dominantAgent,
    isDebating,
    finalResult,
    startDebate,
  } = useDebateStream();

  const { embeddingData, fetchEmbeddings } = useEmbeddings();

  // ── Handlers ──

  const handleSubmit = (text) => {
    // TODO: Set dilemma, switch to "debating" phase, call startDebate()
    // TODO: After debate completes, fetch embeddings and switch to "result"
  };

  const handleRerun = (overrides) => {
    // TODO: Update biasOverrides, re-run debate with new overrides
    // This is triggered by BiasSliders — see AGENT.md §12 step 6
  };

  // ── Render ──

  return (
    <div className="min-h-screen bg-mirror-bg text-white">
      {/* TODO: Conditionally render based on phase */}
      {/* phase === "input"    → <InputScreen onSubmit={handleSubmit} /> */}
      {/* phase === "debating" → <WorkspaceLayout ... /> */}
      {/* phase === "result"   → <ResultBanner ... /> overlaid on WorkspaceLayout */}
    </div>
  );
}
