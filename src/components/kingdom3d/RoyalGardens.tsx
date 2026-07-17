import React from 'react';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

export function RoyalGardens({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);

  // Tree helper
  const Tree = ({ position, scale = 1, isEmerald = false }: { position: [number, number, number], scale?: number, isEmerald?: boolean }) => (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 5]} />
        <meshStandardMaterial color="#4A3B32" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color={isEmerald ? KINGDOM.emerald : KINGDOM.emeraldDeep} roughness={0.8} />
      </mesh>
    </group>
  );

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.emerald} />
      <BuildingTooltip buildingKey="garden" level={level} visible={hovered} position={[0, tier === 3 ? 6 : 4, 0]} />

      {/* Tier 1: Small patch */}
      <TierGroup active={tier === 1}>
        <mesh receiveShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 0.2, 16]} />
          <meshStandardMaterial color={KINGDOM.emeraldDeep} roughness={0.9} />
        </mesh>
        <Tree position={[-1, 0.2, -1]} scale={0.8} />
        <Tree position={[1.2, 0.2, -0.5]} scale={1.1} />
        <Tree position={[-0.5, 0.2, 1.2]} scale={0.9} />
      </TierGroup>

      {/* Tier 2: Blooming garden */}
      <TierGroup active={tier === 2}>
        <mesh receiveShadow position={[0, 0.2, 0]}>
          <cylinderGeometry args={[3.5, 3.8, 0.4, 16]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.8} />
        </mesh>
        <mesh receiveShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[3.2, 3.2, 0.1, 16]} />
          <meshStandardMaterial color={KINGDOM.emeraldDeep} roughness={0.9} />
        </mesh>
        
        {/* Central Fountain */}
        <group position={[0, 0.5, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1, 1.2, 0.4, 12]} />
            <meshStandardMaterial color={KINGDOM.stone} roughness={0.7} />
          </mesh>
          <mesh receiveShadow position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.05, 12]} />
            <meshStandardMaterial color={KINGDOM.crystal} roughness={0.1} />
          </mesh>
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.4, 0.8, 8]} />
            <meshStandardMaterial color={KINGDOM.stone} roughness={0.7} />
          </mesh>
        </group>

        {/* Trees ring */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return <Tree key={i} position={[Math.cos(angle) * 2.2, 0.5, Math.sin(angle) * 2.2]} scale={0.8 + Math.random() * 0.4} />;
        })}
      </TierGroup>

      {/* Tier 3: Paradise garden */}
      <TierGroup active={tier === 3}>
        {/* Layered Platforms */}
        <mesh receiveShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[4.5, 5, 1, 16]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>
        <mesh receiveShadow position={[0, 1.05, 0]}>
          <cylinderGeometry args={[4.2, 4.2, 0.1, 16]} />
          <meshStandardMaterial color={KINGDOM.emeraldDeep} roughness={0.9} />
        </mesh>
        
        <mesh receiveShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[2.5, 3, 1, 16]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.7} />
        </mesh>
        <mesh receiveShadow position={[0, 2.05, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.1, 16]} />
          <meshStandardMaterial color={KINGDOM.emerald} roughness={0.9} />
        </mesh>

        {/* Grand Glowing Fountain */}
        <group position={[0, 2.1, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
            <cylinderGeometry args={[1.2, 1.5, 0.6, 16]} />
            <meshStandardMaterial color={KINGDOM.marble} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[1.1, 1.1, 0.05, 16]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} roughness={0.1} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} />
          </mesh>
          <mesh castShadow position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.3, 0.6, 1.8, 8]} />
            <meshStandardMaterial color={KINGDOM.gold} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Water Spout */}
          <Floating height={0.2} speed={3} yOffset={2.5}>
            <mesh>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshBasicMaterial color={KINGDOM.crystal} transparent opacity={0.6} />
            </mesh>
          </Floating>
        </group>

        {/* Dense Lush Trees */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return <Tree key={`l1-${i}`} position={[Math.cos(angle) * 3.2, 1.1, Math.sin(angle) * 3.2]} scale={1 + Math.random() * 0.5} isEmerald />;
        })}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
          return <Tree key={`l2-${i}`} position={[Math.cos(angle) * 1.8, 2.1, Math.sin(angle) * 1.8]} scale={0.8 + Math.random() * 0.3} />;
        })}

        {/* Floating Petals / Orbs */}
        {[...Array(5)].map((_, i) => (
          <Floating key={`orb-${i}`} height={0.5} speed={1 + Math.random()} yOffset={3 + Math.random()*2}>
            <mesh position={[Math.cos(i) * 2.5, 0, Math.sin(i) * 2.5]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color={KINGDOM.goldLight} emissive={KINGDOM.goldLight} emissiveIntensity={0.6} />
            </mesh>
          </Floating>
        ))}
      </TierGroup>
    </group>
  );
}
