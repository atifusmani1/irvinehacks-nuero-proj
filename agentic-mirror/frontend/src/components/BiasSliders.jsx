/**
 * BiasSliders — Agent Bias Override Controls
 * See AGENT.md §8 — BiasSliders.jsx prop contract
 * See AGENT.md §12 — Demo Script steps 6-7 (the "Money Moment")
 *
 * Renders a Radix UI slider for each bias agent (0-100%).
 * Dragging a slider and clicking "Re-analyze" re-runs the debate
 * with the new bias_overrides, causing the graph to physically shift.
 *
 * Uses: @radix-ui/react-slider
 *
 * @typedef {Object} BiasSlidersProps
 * @property {(overrides: Record<string, number>) => void} onRerun
 */

import { useState } from "react";
// import * as Slider from "@radix-ui/react-slider"; // Uncomment when dependency installed
import { AGENT_COLORS, AGENT_DISPLAY_NAMES } from "../utils/agentColors";

const BIAS_AGENTS = ["loss_aversion", "sunk_cost", "optimism_bias", "status_quo"];

export default function BiasSliders({ onRerun }) {
  const [overrides, setOverrides] = useState({
    loss_aversion: 100,
    sunk_cost: 100,
    optimism_bias: 100,
    status_quo: 100,
  });

  const handleChange = (agent, value) => {
    setOverrides((prev) => ({ ...prev, [agent]: value }));
  };

  const handleRerun = () => {
    // TODO: Call onRerun(overrides) to trigger re-debate
    // See AGENT.md §12 step 6 — "Drag Loss Aversion slider to 20%, hit Re-analyze"
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white/70">Bias Overrides</h3>

      {BIAS_AGENTS.map((agent) => (
        <div key={agent} className="space-y-1">
          {/* TODO: Render agent label with color dot */}
          {/* TODO: Render Radix Slider (0-100) */}
          {/* TODO: Show current value */}
        </div>
      ))}

      <button
        onClick={handleRerun}
        className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors"
      >
        Re-analyze
      </button>
    </div>
  );
}
