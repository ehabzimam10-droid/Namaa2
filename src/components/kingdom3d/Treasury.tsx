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

export function Treasury({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);
  const coinsRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tier === 3 && coinsRef.current) {
      coinsRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.gold} />
      <BuildingTooltip buildingKey="treasury" level={level} visible={hovered} position={[0, tier === 3 ? 8 : 5, 0]} />

      {/* Tier 1: Modest stone vault */}
      <TierGroup active={tier === 1}>
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <boxGeometry args={[2.5, 2, 2.5]} />
          <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} metalness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <sphereGeometry args={[1.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Door */}
        <mesh castShadow receiveShadow position={[0, 0.8, 1.26]}>
          <boxGeometry args={[1, 1.6, 0.1]} />
          <meshStandardMaterial color={KINGDOM.navyCard} roughness={0.9} />
        </mesh>
      </TierGroup>

      {/* Tier 2: Grand treasury hall */}
      <TierGroup active={tier === 2}>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 3]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
        </mesh>
        {/* Columns */}
        {[[-1.8, 1.6], [-0.6, 1.6], [0.6, 1.6], [1.8, 1.6]].map(([x, z], i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 1.5, z]}>
            <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
            <meshStandardMaterial color={KINGDOM.stone} roughness={0.6} />
          </mesh>
        ))}
        {/* Golden Dome */}
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <sphereGeometry args={[1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Floating Coin */}
        <Floating height={0.3} speed={2} yOffset={4.5}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
          </mesh>
        </Floating>
      </TierGroup>

      {/* Tier 3: Legendary vault */}
      <TierGroup active={tier === 3}>
        {/* Base */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[3, 3.5, 2, 16]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
        </mesh>
        {/* Tower */}
        <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
          <cylinderGeometry args={[2.8, 3, 3, 16]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.4} />
        </mesh>
        {/* Massive Golden Dome */}
        <mesh castShadow receiveShadow position={[0, 5, 0]}>
          <sphereGeometry args={[2.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Floating rotating coins ring */}
        <group ref={coinsRef} position={[0, 7, 0]}>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} castShadow position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]} rotation={[Math.PI/2, 0, angle]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
                <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} emissive={KINGDOM.goldGlow} emissiveIntensity={0.2} />
              </mesh>
            );
          })}
        </group>
        
        {/* Floating Chest */}
        <Floating height={0.4} speed={1.5} yOffset={7}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1, 1]} />
            <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 0.5, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.5, 0.5, 1.5, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.6} />
          </mesh>
          {/* Gold Trim */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 0.1, 1.1]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} />
          </mesh>
        </Floating>
      </TierGroup>
    </group>
  );
}
