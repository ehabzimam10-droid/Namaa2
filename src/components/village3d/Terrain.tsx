import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NAMAA } from './palette';

/** Animated Shimmering River / Moat Section */
function RiverStream() {
  const waterMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (waterMatRef.current) {
      // Subtle color oscillation for flowing water effect
      const t = clock.getElapsedTime();
      const wave = Math.sin(t * 1.5) * 0.05;
      waterMatRef.current.roughness = 0.15 + wave;
    }
  });

  return (
    <group name="village-river-and-bridge">
      {/* Curved River Arc wrapping around outer perimeter between R=22 and R=25 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[23.5, 26.5, 64, 1, 0.25, Math.PI * 1.7]} />
        <meshStandardMaterial
          ref={waterMatRef}
          color="#38B6FF"
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* River bank stone trims */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[23.2, 23.5, 64, 1, 0.25, Math.PI * 1.7]} />
        <meshStandardMaterial color="#808F7E" roughness={0.95} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[26.5, 26.8, 64, 1, 0.25, Math.PI * 1.7]} />
        <meshStandardMaterial color="#808F7E" roughness={0.95} />
      </mesh>

      {/* Stone Arch Bridge over the river where the East road crosses (+X) */}
      <group position={[25.0, 0, 0]}>
        {/* Bridge deck */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[3.8, 0.2, 2.4]} />
          <meshStandardMaterial color="#8896A6" roughness={0.85} />
        </mesh>
        {/* Left bridge parapet wall */}
        <mesh castShadow receiveShadow position={[0, 0.55, 1.25]}>
          <boxGeometry args={[3.8, 0.45, 0.2]} />
          <meshStandardMaterial color="#6B7888" roughness={0.9} />
        </mesh>
        {/* Right bridge parapet wall */}
        <mesh castShadow receiveShadow position={[0, 0.55, -1.25]}>
          <boxGeometry args={[3.8, 0.45, 0.2]} />
          <meshStandardMaterial color="#6B7888" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Gentle Rolling Hillocks in the Landscape */
function RollingHills() {
  return (
    <group name="rolling-hills">
      {/* Hill 1: Northwest outside wall */}
      <mesh receiveShadow position={[-24, 0.6, -18]} scale={[12, 1.8, 10]}>
        <sphereGeometry args={[1, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#356D44" roughness={0.95} flatShading />
      </mesh>

      {/* Hill 2: Southwest outside wall */}
      <mesh receiveShadow position={[-22, 0.5, 20]} scale={[11, 1.6, 11]}>
        <sphereGeometry args={[1, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3B784C" roughness={0.95} flatShading />
      </mesh>

      {/* Hill 3: Northeast outside wall */}
      <mesh receiveShadow position={[20, 0.5, -22]} scale={[13, 1.7, 10]}>
        <sphereGeometry args={[1, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#326841" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

export function Terrain() {
  return (
    <group name="village-terrain">
      {/* 1. Main Base Terrain Plain */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={NAMAA.grass} roughness={0.95} />
      </mesh>

      {/* 2. Inner Village Lush Soil Layer (R = 17.8) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[17.8, 64]} />
        <meshStandardMaterial color="#448B57" roughness={0.92} />
      </mesh>

      {/* 3. Outer Darker Forest Ring for visual contrast and depth */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[18.5, 45, 64]} />
        <meshStandardMaterial color="#275635" roughness={0.98} />
      </mesh>

      {/* 4. Natural River Stream & Stone Bridge */}
      <RiverStream />

      {/* 5. Rolling Hillock Topography */}
      <RollingHills />
    </group>
  );
}
