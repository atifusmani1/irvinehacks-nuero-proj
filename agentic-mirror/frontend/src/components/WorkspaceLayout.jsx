/**
 * WorkspaceLayout — Main 3-Panel Layout
 * See AGENT.md §8 — Frontend Component Map
 *
 * Layout:
 *   ┌────────────┬──────────────┬──────────────┐
 *   │ Parliament │ CenterPanel  │ RightSidebar │
 *   │ (3D)       │ ForceGraph + │ BiasSliders  │
 *   │            │ DebateStream │ + Heatmap    │
 *   └────────────┴──────────────┴──────────────┘
 */

import Parliament from "./Parliament";
import ForceGraph from "./ForceGraph";
import DebateStream from "./DebateStream";
import BiasSliders from "./BiasSliders";
import Heatmap from "./Heatmap";

/**
 * @param {Object} props
 * @param {Record<string, number>} props.scores — Bias scores (0-100 per agent)
 * @param {string} props.dominantAgent — Current highest-scoring agent
 * @param {boolean} props.isDebating — Whether debate is in progress
 * @param {Array} props.rounds — Array of completed debate rounds
 * @param {(overrides: Record<string, number>) => void} props.onRerun — Rerun with bias overrides
 * @param {Object|null} props.embeddingData — Heatmap data from /embeddings
 */
export default function WorkspaceLayout({
  scores,
  dominantAgent,
  isDebating,
  rounds,
  onRerun,
  embeddingData,
}) {
  return (
    <div className="flex h-screen w-full bg-mirror-bg">
      {/* Left Panel — 3D Parliament of Agents */}
      <div className="w-1/4 border-r border-white/10">
        {/* TODO: Render <Parliament scores={scores} dominantAgent={dominantAgent} isDebating={isDebating} /> */}
      </div>

      {/* Center Panel — Force Graph + Debate Stream */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {/* TODO: Render <ForceGraph rounds={rounds} scores={scores} /> */}
        </div>
        <div className="h-1/3 border-t border-white/10 overflow-y-auto">
          {/* TODO: Render <DebateStream rounds={rounds} /> */}
        </div>
      </div>

      {/* Right Sidebar — Sliders + Heatmap */}
      <div className="w-1/4 border-l border-white/10 flex flex-col">
        <div className="p-4">
          {/* TODO: Render <BiasSliders onRerun={onRerun} /> */}
        </div>
        <div className="flex-1 p-4">
          {/* TODO: Render <Heatmap ... /> when embeddingData is available */}
        </div>
      </div>
    </div>
  );
}
