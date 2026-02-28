/**
 * Heatmap — 2D Latent Space Scatter Plot
 * See AGENT.md §8 — Heatmap.jsx prop contract
 * See AGENT.md §9 — The Embeddings Pipeline
 * See AGENT.md §12 — Demo Script step 5 (heatmap reveal)
 *
 * Renders a D3 scatter plot showing PCA-reduced embeddings of debate sentences.
 * Points are colored by agent. The user's position is highlighted.
 * Axes are semantically labeled (e.g., "Risk vs Safety", "Past vs Future").
 *
 * Uses: D3.js
 *
 * @typedef {Object} HeatmapProps
 * @property {Array<{x: number, y: number, label: string, agent: string}>} points
 * @property {{x: number, y: number}} userPoint
 * @property {{x: string, y: string}} axes
 */

import { useEffect, useRef } from "react";
// import * as d3 from "d3"; // Uncomment when dependency installed
import { AGENT_COLORS } from "../utils/agentColors";

export default function Heatmap({ points = [], userPoint = null, axes = {} }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    // TODO: Set up D3 scales (x, y) based on point extents
    // TODO: Draw axis labels from axes.x and axes.y
    // TODO: Plot agent points as colored circles (color by agent via AGENT_COLORS)
    // TODO: Plot userPoint as a distinct marker (star or diamond)
    // TODO: Add tooltips showing point labels on hover
    // TODO: Add subtle grid lines
  }, [points, userPoint, axes]);

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white/70 mb-2">
        Cognitive Embedding Space
      </h3>
      <svg ref={svgRef} className="flex-1 w-full" />
    </div>
  );
}
