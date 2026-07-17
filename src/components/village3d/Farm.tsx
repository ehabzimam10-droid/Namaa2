import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

export function Farm({ tier, level, position }: { tier: Tier; level: number; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useHoverLift(hovered);

  return (
    <group 
      position={position} 
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={liftRef}>
        <BuildingTooltip bKey="farm" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.emerald} />
        
        <TierGroup active={tier === 1}>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.8, 12]} />
            <meshStandardMaterial color={NAMAA.stone} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.1, 12]} />
            <meshStandardMaterial color={NAMAA.water} transparent opacity={0.8} />
          </mesh>
        </TierGroup>

        <TierGroup active={tier === 2}>
          <mesh receiveShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.2, 24]} />
            <meshStandardMaterial color={NAMAA.sand} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.2, 24]} />
            <meshStandardMaterial color={NAMAA.water} transparent opacity={0.8} />
          </mesh>
          {/* Palm Trees */}
          {[[-1.2, -1.2], [1.2, 0.6], [-0.6, 1.4]].map(([x, z], i) => (
            <group key={i} position={[x, 0, z]} scale={0.8 + i * 0.2}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 1.2]} />
                <meshStandardMaterial color={NAMAA.wood} />
              </mesh>
              <mesh position={[0, 1.2, 0]} castShadow>
                <coneGeometry args={[0.8, 1, 5]} />
                <meshStandardMaterial color={NAMAA.grassDark} />
              </mesh>
            </group>
          ))}
        </TierGroup>

        <TierGroup active={tier === 3}>
          <mesh receiveShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[2.5, 2.7, 0.3, 24]} />
            <meshStandardMaterial color={NAMAA.emerald} roughness={0.7} />
          </mesh>
          {/* Big Magical Tree */}
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 3.6]} />
            <meshStandardMaterial color={NAMAA.woodDark} />
          </mesh>
          {[0, 1, 2].map(i => (
             <mesh key={i} castShadow position={[0, 3 + i * 1, 0]}>
               <sphereGeometry args={[1.8 - i * 0.4, 16, 16]} />
               <meshStandardMaterial color={NAMAA.emeraldDeep} emissive={NAMAA.emerald} emissiveIntensity={0.2} />
             </mesh>
          ))}
        </TierGroup>
      </group>
    </group>
  );
}
