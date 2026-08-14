import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NAMAA } from './palette';

/** Animated Soaring Birds with Flapping Wings */
function FlyingBirds() {
  const groupRef = useRef<THREE.Group>(null);
  const birds = useMemo(() => [
    { radius: 12, height: 9.5, speed: 0.65, phase: 0, scale: 0.35 },
    { radius: 15, height: 11.0, speed: 0.55, phase: 2.1, scale: 0.4 },
    { radius: 9, height: 8.5, speed: 0.75, phase: 4.2, scale: 0.3 },
    { radius: 18, height: 12.5, speed: 0.45, phase: 1.5, scale: 0.42 },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const b = birds[i];
      const angle = t * b.speed + b.phase;
      const x = Math.cos(angle) * b.radius;
      const z = Math.sin(angle) * b.radius;
      const y = b.height + Math.sin(t * 1.5 + i) * 0.4;

      child.position.set(x, y, z);
      // Orient facing velocity direction (tangent to circle)
      child.rotation.y = -angle + Math.PI / 2;

      // Wing flap animation
      const leftWing = child.getObjectByName('left-wing');
      const rightWing = child.getObjectByName('right-wing');
      const flap = Math.sin(t * 12 + i) * 0.45;
      if (leftWing) leftWing.rotation.z = flap;
      if (rightWing) rightWing.rotation.z = -flap;
    });
  });

  return (
    <group ref={groupRef} name="flying-birds">
      {birds.map((b, i) => (
        <group key={i} scale={b.scale}>
          {/* Bird Torso */}
          <mesh castShadow>
            <coneGeometry args={[0.2, 0.8, 5]} />
            <meshStandardMaterial color="#2B3A4A" roughness={0.7} />
          </mesh>
          {/* Left Wing */}
          <group name="left-wing" position={[-0.1, 0, 0]}>
            <mesh position={[-0.4, 0, 0]}>
              <boxGeometry args={[0.7, 0.03, 0.35]} />
              <meshStandardMaterial color="#3E5062" roughness={0.7} />
            </mesh>
          </group>
          {/* Right Wing */}
          <group name="right-wing" position={[0.1, 0, 0]}>
            <mesh position={[0.4, 0, 0]}>
              <boxGeometry args={[0.7, 0.03, 0.35]} />
              <meshStandardMaterial color="#3E5062" roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Animated Fluttering Butterflies */
function Butterflies() {
  const groupRef = useRef<THREE.Group>(null);
  const butterflies = useMemo(() => [
    { base: [6.0, 0.6, 1.6], color: '#FFAA00', speed: 1.8, phase: 0 },
    { base: [11.0, 0.6, -1.6], color: '#9B5DE5', speed: 1.6, phase: 1.5 },
    { base: [-1.6, 0.6, 6.0], color: '#00F5D4', speed: 2.0, phase: 3.0 },
    { base: [2.8, 0.8, -2.8], color: '#FF006E', speed: 1.7, phase: 4.5 },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const b = butterflies[i];
      const bx = b.base[0] + Math.sin(t * b.speed + b.phase) * 0.8;
      const bz = b.base[2] + Math.cos(t * b.speed * 0.8 + b.phase) * 0.8;
      const by = b.base[1] + Math.sin(t * 4 + i) * 0.25;

      child.position.set(bx, by, bz);
      child.rotation.y = t * b.speed;

      const lw = child.getObjectByName('b-lw');
      const rw = child.getObjectByName('b-rw');
      const flap = Math.sin(t * 18 + i) * 0.8;
      if (lw) lw.rotation.y = flap;
      if (rw) rw.rotation.y = -flap;
    });
  });

  return (
    <group ref={groupRef} name="butterflies">
      {butterflies.map((b, i) => (
        <group key={i} scale={0.25}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <group name="b-lw" position={[-0.04, 0, 0]}>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.35, 0.02, 0.25]} />
              <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.3} />
            </mesh>
          </group>
          <group name="b-rw" position={[0.04, 0, 0]}>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.35, 0.02, 0.25]} />
              <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.3} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Slow Drifting Low-Poly Clouds */
function DriftingClouds() {
  const groupRef = useRef<THREE.Group>(null);
  const cloudData = useMemo(() => [
    { startX: -35, y: 15, z: -18, scale: 1.3, speed: 0.4 },
    { startX: -20, y: 17, z: 12, scale: 1.5, speed: 0.35 },
    { startX: 10, y: 16, z: -25, scale: 1.2, speed: 0.45 },
    { startX: -45, y: 18, z: 22, scale: 1.6, speed: 0.3 },
    { startX: 5, y: 14.5, z: 8, scale: 1.1, speed: 0.5 },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const cd = cloudData[i];
      // Move from -45 to +45, then wrap
      const span = 90;
      const x = ((cd.startX + t * cd.speed + 45) % span) - 45;
      child.position.set(x, cd.y, cd.z);
    });
  });

  return (
    <group ref={groupRef} name="drifting-clouds">
      {cloudData.map((cd, idx) => (
        <group key={idx} scale={cd.scale}>
          {/* Cloud clusters */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1.5, 7, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.88} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.2, -0.2, 0.3]}>
            <sphereGeometry args={[1.1, 7, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.88} />
          </mesh>
          <mesh castShadow receiveShadow position={[-1.2, -0.2, -0.2]}>
            <sphereGeometry args={[1.0, 7, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.88} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.4, 0.6, -0.2]}>
            <sphereGeometry args={[0.9, 7, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.88} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Ornate Street Lamppost with Warm Light */
export function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stone Base */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.3, 8]} />
        <meshStandardMaterial color="#505A66" roughness={0.9} />
      </mesh>

      {/* Metal Pole */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 1.4, 8]} />
        <meshStandardMaterial color="#1E252E" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Lamp Arm & Cap */}
      <mesh castShadow position={[0, 1.7, 0]}>
        <coneGeometry args={[0.22, 0.12, 6]} />
        <meshStandardMaterial color="#1E252E" roughness={0.6} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={NAMAA.gold} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing Warm Lantern Sphere */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial
          color="#FFEAA7"
          emissive="#FFB900"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Central Town Plaza Fountain with Water Spout */
export function TownFountain({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.rotation.z = clock.getElapsedTime() * 0.3;
      const s = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.02;
      waterRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={position}>
      {/* Octagonal Stone Outer Wall */}
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.55, 8]} />
        <meshStandardMaterial color="#7D8794" roughness={0.9} />
      </mesh>
      {/* Curb Rim */}
      <mesh castShadow receiveShadow position={[0, 0.56, 0]}>
        <cylinderGeometry args={[1.58, 1.58, 0.08, 8]} />
        <meshStandardMaterial color="#5E6875" roughness={0.85} />
      </mesh>

      {/* Water Pool */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.44, 0]}
      >
        <circleGeometry args={[1.35, 24]} />
        <meshStandardMaterial
          color="#4FC3F7"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Central Stone Pillar */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial color="#6B7582" roughness={0.9} />
      </mesh>
      {/* Upper Bowl */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.4, 0.25, 8]} />
        <meshStandardMaterial color="#7D8794" roughness={0.85} />
      </mesh>
      {/* Golden Finial */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={NAMAA.gold} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

/** Village Market Benches, Barrels & Hay Bales */
function VillageProps() {
  return (
    <group name="village-interactive-props">
      {/* Plaza Wooden Benches */}
      <group position={[2.8, 0, -1.8]} rotation={[0, -Math.PI / 3, 0]}>
        <mesh castShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[1.1, 0.08, 0.35]} />
          <meshStandardMaterial color="#593B26" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 0.45, -0.15]}>
          <boxGeometry args={[1.1, 0.35, 0.06]} />
          <meshStandardMaterial color="#593B26" roughness={0.85} />
        </mesh>
        {[-0.45, 0.45].map((bx) => (
          <mesh key={bx} castShadow position={[bx, 0.1, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.32]} />
            <meshStandardMaterial color="#2B1A0E" roughness={0.9} />
          </mesh>
        ))}
      </group>

      <group position={[-2.8, 0, 1.8]} rotation={[0, Math.PI * 0.7, 0]}>
        <mesh castShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[1.1, 0.08, 0.35]} />
          <meshStandardMaterial color="#593B26" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 0.45, -0.15]}>
          <boxGeometry args={[1.1, 0.35, 0.06]} />
          <meshStandardMaterial color="#593B26" roughness={0.85} />
        </mesh>
        {[-0.45, 0.45].map((bx) => (
          <mesh key={bx} castShadow position={[bx, 0.1, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.32]} />
            <meshStandardMaterial color="#2B1A0E" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Market Fruit Crates & Barrels */}
      <group position={[9.8, 0, 7.2]}>
        {/* Barrel */}
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.26, 0.24, 0.7, 10]} />
          <meshStandardMaterial color="#6B4326" roughness={0.85} />
        </mesh>
        {/* Fruit crate */}
        <mesh castShadow position={[0.55, 0.18, -0.2]}>
          <boxGeometry args={[0.45, 0.32, 0.45]} />
          <meshStandardMaterial color="#8A5A36" roughness={0.8} />
        </mesh>
        {/* Apples in crate */}
        <mesh position={[0.55, 0.36, -0.2]}>
          <sphereGeometry args={[0.14, 6, 6]} />
          <meshStandardMaterial color="#E63946" roughness={0.4} />
        </mesh>
      </group>

      {/* Farm Hay Bales & Wooden Cart */}
      <group position={[7.2, 0, -9.8]}>
        {/* Hay bale stack */}
        <mesh castShadow position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.65, 8]} />
          <meshStandardMaterial color="#E9C46A" roughness={0.95} />
        </mesh>
        <mesh castShadow position={[0.45, 0.24, 0.2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.65, 8]} />
          <meshStandardMaterial color="#F4A261" roughness={0.95} />
        </mesh>
        <mesh castShadow position={[0.22, 0.68, 0.1]}>
          <cylinderGeometry args={[0.32, 0.32, 0.65, 8]} />
          <meshStandardMaterial color="#E9C46A" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export function VillageAtmosphere() {
  return (
    <group name="village-atmosphere">
      {/* 1. Flying Swallows */}
      <FlyingBirds />

      {/* 2. Fluttering Butterflies */}
      <Butterflies />

      {/* 3. Drifting Fluffy Clouds */}
      <DriftingClouds />

      {/* 4. Town Props & Fountain */}
      <VillageProps />

      {/* 5. Street Lanterns along Avenues */}
      {/* Main East Avenue to Gate */}
      <StreetLamp position={[5.5, 0, 1.5]} />
      <StreetLamp position={[9.5, 0, 1.5]} />
      <StreetLamp position={[13.5, 0, 1.5]} />
      <StreetLamp position={[5.5, 0, -1.5]} />
      <StreetLamp position={[9.5, 0, -1.5]} />
      <StreetLamp position={[13.5, 0, -1.5]} />

      {/* North Avenue */}
      <StreetLamp position={[-1.2, 0, -5.5]} />
      <StreetLamp position={[1.2, 0, -5.5]} />

      {/* South Avenue */}
      <StreetLamp position={[-1.2, 0, 5.5]} />
      <StreetLamp position={[1.2, 0, 5.5]} />

      {/* West Avenue */}
      <StreetLamp position={[-5.5, 0, -1.2]} />
      <StreetLamp position={[-5.5, 0, 1.2]} />
    </group>
  );
}
