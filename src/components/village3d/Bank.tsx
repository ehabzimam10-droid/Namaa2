import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

export function Bank({ tier, level, position }: { tier: Tier; level: number; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useHoverLift(hovered);

  return (
    <group 
      position={position} 
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={liftRef}>
        <BuildingTooltip bKey="bank" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.goldLight} />
        
        <TierGroup active={tier === 1}>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[1.2, 0.8, 1]} />
            <meshStandardMaterial color={NAMAA.wood} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[1.3, 0.1, 1.1]} />
            <meshStandardMaterial color={NAMAA.goldDark} metalness={0.6} />
          </mesh>
        </TierGroup>

        <TierGroup active={tier === 2}>
          <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[1.8, 1.4, 1.8]} />
            <meshStandardMaterial color={NAMAA.stone} />
          </mesh>
          {/* Columns */}
          {[-0.7, 0.7].map(x => [-0.7, 0.7].map(z => (
            <mesh key={`${x}-${z}`} castShadow position={[x, 0.7, z]}>
              <cylinderGeometry args={[0.15, 0.15, 1.6]} />
              <meshStandardMaterial color={NAMAA.white} />
            </mesh>
          )))}
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[1.6, 0.8, 4]} />
            <meshStandardMaterial color={NAMAA.goldDark} metalness={0.4} />
          </mesh>
        </TierGroup>

        <TierGroup active={tier === 3}>
          <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[1.4, 1.6, 2.4, 8]} />
            <meshStandardMaterial color={NAMAA.stoneDark} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.8} roughness={0.2} />
          </mesh>
          <Floating height={0.3} speed={3} yOffset={3.6}>
            <mesh castShadow rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.8, 0.8, 0.15, 24]} />
              <meshStandardMaterial color={NAMAA.goldLight} metalness={1} roughness={0.1} emissive={NAMAA.gold} emissiveIntensity={0.3} />
            </mesh>
          </Floating>
        </TierGroup>
      </group>
    </group>
  );
}
