/**
 * CameraController — R3F component that lerps the camera toward a target sphere.
 *
 * Usage (inside a <Canvas>):
 *   <CameraController
 *     targetPosition={[x, y, z]}   // sphere position to focus on, or null for default
 *     orbitRef={orbitControlsRef}   // ref to <OrbitControls>
 *     defaultPosition={[0, 0, 10]} // resting camera position
 *     offset={[0, 1.5, 5]}         // offset from the sphere (local z-forward)
 *     damping={0.04}               // lerp speed per frame
 *   />
 *
 * When targetPosition is non-null the camera smoothly glides to
 * targetPosition + offset and looks at targetPosition.
 * OrbitControls are disabled during the glide.
 * When targetPosition becomes null the camera returns to defaultPosition
 * and OrbitControls are re-enabled with autoRotate.
 */

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const _targetPos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();

export default function CameraController({
  targetPosition = null,
  orbitRef = null,
  defaultPosition = [0, 0, 10],
  offset = [0, 1.5, 5],
  damping = 0.04,
}) {
  const { camera } = useThree();
  const goalPos = useRef(new THREE.Vector3(...defaultPosition));
  const goalLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  const hasTarget = targetPosition != null;

  // Update goal whenever targetPosition changes
  useEffect(() => {
    if (hasTarget) {
      const [sx, sy, sz] = targetPosition;
      goalPos.current.set(sx + offset[0], sy + offset[1], sz + offset[2]);
      goalLookAt.current.set(sx, sy, sz);
      isAnimating.current = true;

      // Disable OrbitControls while focusing
      if (orbitRef?.current) {
        orbitRef.current.enabled = false;
        orbitRef.current.autoRotate = false;
      }
    } else {
      goalPos.current.set(...defaultPosition);
      goalLookAt.current.set(0, 0, 0);
      isAnimating.current = true;
    }
  }, [hasTarget, targetPosition?.[0], targetPosition?.[1], targetPosition?.[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    if (!isAnimating.current) return;

    // Lerp camera position
    camera.position.lerp(goalPos.current, damping);

    // Lerp lookAt
    _currentLookAt.setFromMatrixPosition(camera.matrixWorld);
    // Compute where the camera is currently looking (a point 1 unit in front)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    _currentLookAt.copy(camera.position).add(forward.multiplyScalar(10));
    _currentLookAt.lerp(goalLookAt.current, damping);
    camera.lookAt(_currentLookAt);

    // Check if close enough to stop
    const posDist = camera.position.distanceTo(goalPos.current);
    if (posDist < 0.01) {
      camera.position.copy(goalPos.current);
      camera.lookAt(goalLookAt.current);
      isAnimating.current = false;

      // Re-enable OrbitControls when returning to default (no target)
      if (!hasTarget && orbitRef?.current) {
        orbitRef.current.enabled = true;
        orbitRef.current.autoRotate = true;
        // Reset the OrbitControls target to center
        orbitRef.current.target.set(0, 0, 0);
        orbitRef.current.update();
      }
    }
  });

  return null;
}
