/**
 * Parliament — 3D Agent Sphere Visualization
 * See AGENT.md §8 — Parliament.jsx prop contract
 * See AGENT.md §11 — Agent Color & Visual Identity Map
 * See AGENT.md §12 — Demo Script steps 2-3
 *
 * Renders a Three.js canvas with 5 AgentSphere instances (4 bias + 1 rationalist).
 * Sphere size scales with agent score. The dominant agent glows brighter.
 *
 * Uses: @react-three/fiber, @react-three/drei
 *
 * @typedef {Object} ParliamentProps
 * @property {Record<string, number>} scores — 0-100 per agent, updates live
 * @property {string} dominantAgent — Highest scoring agent name
 * @property {boolean} isDebating — Whether the debate is currently running
 */

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AgentSphere from "./AgentSphere";
import { AGENT_COLORS, AGENT_NAMES } from "../utils/agentColors";

export default function Parliament({ scores = {}, dominantAgent = "", isDebating = false }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        {/* TODO: Add ambient + point lighting */}
        {/* TODO: Map AGENT_NAMES to <AgentSphere> components */}
        {/*   - Position spheres in a circular arrangement */}
        {/*   - Pass score, color, isDominant, isDebating to each */}
        {/* TODO: Add OrbitControls for user interaction */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
