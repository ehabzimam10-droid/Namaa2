import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst } from './utils';

export function Palace({ tier, level, position }: { tier: Tier; level: number; position: [number, number, number] }) {
  return (
    <group position={position}>
      <ParticleBurst trigger={level} color={NAMAA.gold} />
      
      <TierGroup active={tier === 1}>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[1.4, 1.6, 2.4, 8]} />
          <meshStandardMaterial color={NAMAA.stone} />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <coneGeometry args={[1.6, 1.6, 8]} />
          <meshStandardMaterial color={NAMAA.purple} />
        </mesh>
      </TierGroup>

      <TierGroup active={tier === 2}>
        <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
          <boxGeometry args={[3, 3.6, 3]} />
          <meshStandardMaterial color={NAMAA.stone} />
        </mesh>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
          <group key={i} position={[x * 1.6, 0, z * 1.6]}>
            <mesh castShadow position={[0, 2.4, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 4.8, 8]} />
              <meshStandardMaterial color={NAMAA.stoneDark} />
            </mesh>
            <mesh position={[0, 5.4, 0]}>
              <coneGeometry args={[0.8, 1.4, 8]} />
              <meshStandardMaterial color={NAMAA.purple} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 4.6, 0]}>
          <sphereGeometry args={[1.6, 16, 16, 0, Math.PI*2, 0, Math.PI/2]} />
          <meshStandardMaterial color={NAMAA.purpleBright} />
        </mesh>
      </TierGroup>

      <TierGroup active={tier === 3}>
        <mesh castShadow receiveShadow position={[0, 2.4, 0]}>
          <cylinderGeometry args={[3, 3.6, 4.8, 12]} />
          <meshStandardMaterial color={NAMAA.white} />
        </mesh>
        {/* Main Dome */}
        <mesh position={[0, 5.4, 0]}>
          <sphereGeometry args={[2.6, 32, 32, 0, Math.PI*2, 0, Math.PI/2]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 8, 0]}>
           <cylinderGeometry args={[0.15, 0.15, 2]} />
           <meshStandardMaterial color={NAMAA.goldLight} emissive={NAMAA.goldLight} emissiveIntensity={0.6} />
        </mesh>
        
        {/* Towers */}
        {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => (
          <group key={i} position={[Math.cos(angle) * 3.4, 0, Math.sin(angle) * 3.4]}>
            <mesh castShadow position={[0, 3, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 6, 12]} />
              <meshStandardMaterial color={NAMAA.white} />
            </mesh>
            <mesh position={[0, 6.6, 0]}>
              <sphereGeometry args={[1, 24, 24, 0, Math.PI*2, 0, Math.PI/2]} />
              <meshStandardMaterial color={NAMAA.gold} metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </TierGroup>
    </group>
  );
}
