import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

export function Windmill({ tier, level, position }: { tier: Tier; level: number; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useHoverLift(hovered);
  
  const bladesRef1 = useRef<THREE.Group>(null);
  const bladesRef2 = useRef<THREE.Group>(null);
  const bladesRef3 = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    const speed = level * 0.8; // scales with level
    if (bladesRef1.current) bladesRef1.current.rotation.z += speed * delta;
    if (bladesRef2.current) bladesRef2.current.rotation.z += (speed + 1) * delta;
    if (bladesRef3.current) bladesRef3.current.rotation.z += (speed + 2) * delta;
  });

  return (
    <group 
      position={position} 
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={liftRef}>
        <BuildingTooltip bKey="windmill" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.purpleBright} />
        
        <TierGroup active={tier === 1}>
          <mesh castShadow receiveShadow position={[0, 1, 0]}>
            <coneGeometry args={[0.8, 2, 6]} />
            <meshStandardMaterial color={NAMAA.woodDark} />
          </mesh>
          <group ref={bladesRef1} position={[0, 1.5, 0.5]}>
            {[0, 1, 2, 3].map(i => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0]}>
                <boxGeometry args={[0.15, 1.6, 0.05]} />
                <meshStandardMaterial color={NAMAA.white} />
              </mesh>
            ))}
          </group>
        </TierGroup>

        <TierGroup active={tier === 2}>
          <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.8, 1, 2.8, 8]} />
            <meshStandardMaterial color={NAMAA.stone} />
          </mesh>
          <mesh position={[0, 3.1, 0]}>
            <coneGeometry args={[0.9, 1, 8]} />
            <meshStandardMaterial color={NAMAA.copper} />
          </mesh>
          <group ref={bladesRef2} position={[0, 2.4, 0.9]}>
             {[0, 1, 2, 3].map(i => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
                 <mesh position={[0, 1, 0]}>
                   <boxGeometry args={[0.4, 2, 0.1]} />
                   <meshStandardMaterial color={NAMAA.copperDeep} />
                 </mesh>
              </mesh>
            ))}
          </group>
        </TierGroup>

        <TierGroup active={tier === 3}>
          <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.9, 1.2, 3.6, 12]} />
            <meshStandardMaterial color={NAMAA.purpleDeep} />
          </mesh>
          <mesh position={[0, 3.6, 0]}>
            <sphereGeometry args={[1, 16, 16, 0, Math.PI*2, 0, Math.PI/2]} />
            <meshStandardMaterial color={NAMAA.gold} />
          </mesh>
          <group ref={bladesRef3} position={[0, 3, 1]}>
             {[0, 1, 2, 3, 4, 5].map(i => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
                 <mesh position={[0, 1.2, 0]}>
                   <boxGeometry args={[0.5, 2.4, 0.15]} />
                   <meshStandardMaterial color={NAMAA.purpleBright} emissive={NAMAA.purpleBright} emissiveIntensity={0.6} transparent opacity={0.9} />
                 </mesh>
              </mesh>
            ))}
          </group>
        </TierGroup>
      </group>
    </group>
  );
}
