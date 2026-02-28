/**
 * ForceGraph — 3D Force-Directed Debate Visualization
 * See AGENT.md §8 — CenterPanel > ForceGraph
 * See AGENT.md §12 — Demo Script step 4 (user node drifting toward dominant agent)
 *
 * Renders a force-directed graph where:
 *   - Each agent is a node (colored per AGENT.md §11)
 *   - The user's dilemma is a central node
 *   - Links form between agents and user, weighted by score
 *   - The user node physically drifts toward the dominant agent
 *
 * Uses: react-force-graph-3d
 */

import { useRef, useMemo } from "react";
// import ForceGraph3D from "react-force-graph-3d"; // Uncomment when dependency installed
import { AGENT_COLORS } from "../utils/agentColors";

/**
 * @param {Object} props
 * @param {Array} props.rounds — Completed debate rounds (dialogue + scores)
 * @param {Record<string, number>} props.scores — Current bias scores
 */
export default function ForceGraph({ rounds = [], scores = {} }) {
  const graphRef = useRef();

  // Build graph data from debate rounds
  const graphData = useMemo(() => {
    // TODO: Create nodes for each agent + user center node
    // TODO: Create links between user and agents, weighted by score
    // TODO: Update link strength and distance based on scores
    //   - Higher score = shorter distance (user pulled toward that bias)
    //   - See AGENT.md §12 step 4
    return { nodes: [], links: [] };
  }, [rounds, scores]);

  return (
    <div className="w-full h-full">
      {/* TODO: Render <ForceGraph3D> with graphData */}
      {/* TODO: Custom node rendering with agent colors */}
      {/* TODO: Custom link rendering with thickness based on score */}
    </div>
  );
}
