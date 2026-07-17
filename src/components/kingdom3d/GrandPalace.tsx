import React from 'react';
import * as THREE from 'three';
import { TierGroup, ParticleBurst, useHoverLift } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

export function GrandPalace({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.gold} />
      <BuildingTooltip buildingKey="palace" level={level} visible={hovered} position={[0, tier === 3 ? 12 : 8, 0]} />

      {/* Tier 1: Imposing castle keep */}
      <TierGroup active={tier === 1}>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <cylinderGeometry args={[2.5, 2.8, 4, 8]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.7} />
        </mesh>
        {/* 4 Corner Turrets */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
          <group key={i} position={[x * 2.2, 2.5, z * 2.2]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 5, 8]} />
              <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3, 0]}>
              <coneGeometry args={[0.8, 1.5, 8]} />
              <meshStandardMaterial color={KINGDOM.purple} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </TierGroup>

      {/* Tier 2: Royal palace complex */}
      <TierGroup active={tier === 2}>
        {/* Main Hall */}
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxGeometry args={[6, 4, 4]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
        </mesh>
        {/* Golden Domes */}
        <mesh castShadow receiveShadow position={[-1.5, 4, 0]}>
          <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[1.5, 4, 0]}>
          <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Central Spire */}
        <mesh castShadow receiveShadow position={[0, 5, 0]}>
          <cylinderGeometry args={[0.4, 0.8, 6, 8]} />
          <meshStandardMaterial color={KINGDOM.stone} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 8.5, 0]}>
          <coneGeometry args={[0.6, 2, 8]} />
          <meshStandardMaterial color={KINGDOM.purpleBright} roughness={0.3} />
        </mesh>
      </TierGroup>

      {/* Tier 3: Legendary palace */}
      <TierGroup active={tier === 3}>
        {/* Massive Base */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[5, 6, 3, 12]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 4, 0]}>
          <cylinderGeometry args={[4.5, 4.5, 2, 12]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.4} />
        </mesh>
        
        {/* Central Mega-Dome */}
        <mesh castShadow receiveShadow position={[0, 5, 0]}>
          <sphereGeometry args={[3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Crown Ring */}
        <mesh castShadow position={[0, 8.5, 0]}>
          <torusGeometry args={[1.5, 0.15, 8, 24]} />
          <meshStandardMaterial color={KINGDOM.goldGlow} metalness={0.8} emissive={KINGDOM.gold} emissiveIntensity={0.5} />
        </mesh>

        {/* 8 Golden Domes around */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 4;
          return (
            <group key={i} position={[Math.cos(angle) * r, 3, Math.sin(angle) * r]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.8, 1, 6, 8]} />
                <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 3, 0]}>
                <sphereGeometry args={[0.9, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Tallest Spire & Banner */}
        <group position={[0, 8.5, -2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.5, 5, 8]} />
            <meshStandardMaterial color={KINGDOM.stone} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
            <coneGeometry args={[0.4, 1.5, 8]} />
            <meshStandardMaterial color={KINGDOM.gold} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.7, 1.5, 0]}>
            <boxGeometry args={[1.2, 2, 0.05]} />
            <meshStandardMaterial color={KINGDOM.crimson} />
          </mesh>
        </group>

        {/* Light Beam */}
        <mesh position={[0, 10, 0]}>
          <cylinderGeometry args={[0.5, 2, 10, 16]} />
          <meshBasicMaterial color={KINGDOM.goldGlow} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
      </TierGroup>
    </group>
  );
}
