import React from 'react';
import * as THREE from 'three';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';
import { useFrame } from '@react-three/fiber';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

export function WisdomTower({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);
  const ringRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (tier === 3 && ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.8;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.purpleBright} />
      <BuildingTooltip buildingKey="tower" level={level} visible={hovered} position={[0, tier === 3 ? 12 : 8, 0]} />

      {/* Tier 1: Short stone tower */}
      <TierGroup active={tier === 1}>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 3, 8]} />
          <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 3.8, 0]}>
          <coneGeometry args={[1.8, 1.6, 8]} />
          <meshStandardMaterial color={KINGDOM.navyCard} roughness={0.6} />
        </mesh>
      </TierGroup>

      {/* Tier 2: Library tower */}
      <TierGroup active={tier === 2}>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <cylinderGeometry args={[1.8, 2.2, 6, 12]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
        </mesh>
        
        {/* Arched windows */}
        {[...Array(4)].map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <mesh castShadow position={[0, 4, 1.8]}>
              <boxGeometry args={[0.8, 1.5, 0.2]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}

        <mesh castShadow position={[0, 6.5, 0]}>
          <boxGeometry args={[2.5, 0.4, 2.5]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} />
        </mesh>
        {/* Book on top */}
        <mesh castShadow position={[0, 6.8, 0]} rotation={[0, Math.PI/4, 0]}>
          <boxGeometry args={[1.2, 0.2, 1.6]} />
          <meshStandardMaterial color={KINGDOM.crimson} />
        </mesh>
      </TierGroup>

      {/* Tier 3: Arcane tower */}
      <TierGroup active={tier === 3}>
        {/* Base */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[3, 3.5, 2, 16]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>

        {/* Spiral Tower Sections */}
        {[...Array(4)].map((_, i) => {
          const y = 3 + i * 1.8;
          const radius = 2.5 - i * 0.3;
          return (
            <mesh key={i} castShadow receiveShadow position={[0, y, 0]} rotation={[0, i * 0.4, 0]}>
              <cylinderGeometry args={[radius, radius + 0.2, 1.8, 8]} />
              <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
            </mesh>
          );
        })}

        {/* Top Platform */}
        <mesh castShadow receiveShadow position={[0, 9.5, 0]}>
          <cylinderGeometry args={[1.8, 1.2, 0.5, 12]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.7} />
        </mesh>

        {/* Floating Emissive Orb & Ring */}
        <Floating height={0.3} speed={2} yOffset={10.8}>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color={KINGDOM.purpleBright} emissive={KINGDOM.purpleBright} emissiveIntensity={0.8} />
          </mesh>
          <mesh ref={ringRef}>
            <torusGeometry args={[1.4, 0.1, 8, 32]} />
            <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.6} />
          </mesh>
        </Floating>

        {/* Floating Runes/Particles */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <Floating key={`rune-${i}`} height={0.4} speed={1 + Math.random()} yOffset={5 + i}>
              <mesh position={[Math.cos(angle) * 3, 0, Math.sin(angle) * 3]}>
                <boxGeometry args={[0.2, 0.4, 0.05]} />
                <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} />
              </mesh>
            </Floating>
          );
        })}
      </TierGroup>
    </group>
  );
}
