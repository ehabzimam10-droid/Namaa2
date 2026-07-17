import React from 'react';
import * as THREE from 'three';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

export function TradeHarbor({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);

  // Helper tent
  const Tent = ({ position, color }: { position: [number, number, number], color: string }) => (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color={KINGDOM.stone} />
      </mesh>
      <mesh castShadow position={[0, 1.2, 0]} rotation={[0, Math.PI/4, 0]}>
        <coneGeometry args={[1.1, 1, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.teal} />
      <BuildingTooltip buildingKey="harbor" level={level} visible={hovered} position={[0, tier === 3 ? 9 : 5, 0]} />

      {/* Tier 1: Wooden pier */}
      <TierGroup active={tier === 1}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 4]} />
          <meshStandardMaterial color="#5C4033" roughness={0.9} /> {/* Wood */}
        </mesh>
        <mesh castShadow position={[-1, 1.5, -1]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
        <mesh castShadow position={[1, 1.5, 1]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
      </TierGroup>

      {/* Tier 2: Harbor market */}
      <TierGroup active={tier === 2}>
        <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[5, 1.5, 5]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>
        <Tent position={[-1.2, 1.5, -1.2]} color={KINGDOM.crimson} />
        <Tent position={[1.2, 1.5, 1.2]} color={KINGDOM.amber} />
        <Tent position={[-1.2, 1.5, 1.2]} color={KINGDOM.teal} />
        
        {/* Trade flags */}
        <mesh castShadow position={[2, 2.5, -2]}>
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
        <mesh castShadow position={[2, 3.5, -1.6]} rotation={[0, 0, -Math.PI/2]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial color={KINGDOM.gold} side={THREE.DoubleSide} />
        </mesh>
      </TierGroup>

      {/* Tier 3: Grand harbor */}
      <TierGroup active={tier === 3}>
        {/* Massive Stone Dock */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[4.5, 4.5, 2, 8]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>

        {/* Tall Lighthouse */}
        <group position={[-2, 2, -2]}>
          <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.8, 1.2, 4, 8]} />
            <meshStandardMaterial color={KINGDOM.marble} />
          </mesh>
          {/* Light source */}
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 1, 8]} />
            <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.8} />
          </mesh>
          <mesh castShadow position={[0, 5.5, 0]}>
            <coneGeometry args={[1, 1, 8]} />
            <meshStandardMaterial color={KINGDOM.crimson} />
          </mesh>
        </group>

        {/* Grand Market */}
        <Tent position={[1.5, 2, 1.5]} color={KINGDOM.purpleBright} />
        <Tent position={[1.5, 2, -1]} color={KINGDOM.goldDark} />

        {/* Investment Graph Bars (abstract representation of growth) */}
        <group position={[-1, 2, 2]}>
          {[0.5, 1.2, 2.2, 3.5].map((h, i) => (
            <mesh key={i} castShadow position={[i * 0.8, h/2, 0]}>
              <boxGeometry args={[0.5, h, 0.5]} />
              <meshStandardMaterial color={KINGDOM.emerald} metalness={0.4} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Golden Ship Mast abstract */}
        <Floating height={0.2} speed={1.5} yOffset={0}>
          <group position={[3.5, 1, 3.5]}>
            <mesh castShadow position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
              <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[0.8, 3, 0]}>
              <boxGeometry args={[1.6, 2, 0.05]} />
              <meshStandardMaterial color={KINGDOM.white} transparent opacity={0.8} />
            </mesh>
          </group>
        </Floating>
      </TierGroup>
    </group>
  );
}
