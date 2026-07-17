import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

export function Market({ tier, level, position }: { tier: Tier; level: number; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useHoverLift(hovered);

  return (
    <group 
      position={position} 
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={liftRef}>
        <BuildingTooltip bKey="market" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.amber} />
        
        <TierGroup active={tier === 1}>
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1.4, 1, 1]} />
            <meshStandardMaterial color={NAMAA.woodDark} />
          </mesh>
          <mesh castShadow position={[0, 1.3, 0]}>
            <coneGeometry args={[1.1, 0.8, 4]} />
            <meshStandardMaterial color={NAMAA.amber} />
          </mesh>
        </TierGroup>

        <TierGroup active={tier === 2}>
           <group position={[-0.8, 0, -0.4]}>
             <mesh castShadow position={[0, 0.9, 0]}>
              <cylinderGeometry args={[1, 1, 1.8, 6]} />
              <meshStandardMaterial color={NAMAA.amberDeep} />
             </mesh>
             <mesh castShadow position={[0, 2.3, 0]}>
              <coneGeometry args={[1.2, 1, 6]} />
              <meshStandardMaterial color={NAMAA.white} />
             </mesh>
           </group>
           <group position={[1, 0, 0.6]} scale={0.8}>
             <mesh castShadow position={[0, 0.9, 0]}>
              <cylinderGeometry args={[1, 1, 1.8, 6]} />
              <meshStandardMaterial color={NAMAA.copper} />
             </mesh>
             <mesh castShadow position={[0, 2.3, 0]}>
              <coneGeometry args={[1.2, 1, 6]} />
              <meshStandardMaterial color={NAMAA.white} />
             </mesh>
           </group>
           <mesh castShadow position={[0, 0.3, -1.2]}>
             <boxGeometry args={[0.8, 0.6, 0.6]} />
             <meshStandardMaterial color={NAMAA.wood} />
           </mesh>
        </TierGroup>

        <TierGroup active={tier === 3}>
          {/* Grand Bazaar */}
          <mesh receiveShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
            <meshStandardMaterial color={NAMAA.copperDeep} />
          </mesh>
          <mesh castShadow position={[0, 1.5, 0]}>
             <cylinderGeometry args={[1.8, 1.8, 2.8, 12]} />
             <meshStandardMaterial color={NAMAA.amber} />
          </mesh>
          <mesh castShadow position={[0, 3.7, 0]}>
             <sphereGeometry args={[2, 16, 16, 0, Math.PI*2, 0, Math.PI/2]} />
             <meshStandardMaterial color={NAMAA.goldLight} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
             <cylinderGeometry args={[0.15, 0.15, 1.2]} />
             <meshStandardMaterial color={NAMAA.gold} emissive={NAMAA.gold} emissiveIntensity={0.5} />
          </mesh>
        </TierGroup>
      </group>
    </group>
  );
}
