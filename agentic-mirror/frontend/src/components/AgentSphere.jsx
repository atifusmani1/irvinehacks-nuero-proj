/**
 * AgentSphere — Individual 3D Sphere for a Bias Agent
 * See AGENT.md §11 — Agent Color & Visual Identity Map
 *
 * Sphere behavior per agent:
 *   - Loss Aversion (#E53E3E): Pulses on financial keywords
 *   - Sunk Cost (#D69E2E): Grows when past tense detected
 *   - Optimism Bias (#00B5D8): Brightens on market/growth words
 *   - Status Quo (#4A6FA5): Steady glow, slow rotation
 *   - Rationalist (#E2E8F0): Constant, never changes size
 *
 * Uses: @react-three/fiber, @react-three/drei
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * @param {Object} props
 * @param {[number, number, number]} props.position — 3D position in the scene
 * @param {string} props.color — Hex color from AGENT.md §11
 * @param {number} props.score — Agent's current dominance score (0-100)
 * @param {boolean} props.isDominant — Whether this is the highest-scoring agent
 * @param {boolean} props.isDebating — Whether the debate is running
 * @param {string} props.agentName — Agent identifier string
 */
export default function AgentSphere({
  position = [0, 0, 0],
  color = "#E2E8F0",
  score = 25,
  isDominant = false,
  isDebating = false,
  agentName = "",
}) {
  const meshRef = useRef();

  // Scale sphere size based on score (0-100 → 0.3-2.0 radius)
  const baseScale = 0.3 + (score / 100) * 1.7;

  useFrame((state, delta) => {
    // TODO: Implement per-agent animation behaviors (AGENT.md §11)
    //   - Loss Aversion: pulse effect (scale oscillation)
    //   - Sunk Cost: gradual size increase
    //   - Optimism Bias: emissive intensity grows
    //   - Status Quo: slow Y-axis rotation
    //   - Rationalist: no animation (constant)
    // TODO: Add glow effect for isDominant
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* TODO: Sphere geometry scaled by score */}
      {/* TODO: Material with emissive glow using agent color */}
      <sphereGeometry args={[baseScale, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isDominant ? 0.8 : 0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
