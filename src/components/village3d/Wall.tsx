import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup } from './utils';

export function Wall({ tier }: { tier: Tier }) {
  return (
    <group>
      <TierGroup active={tier === 1}>
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[6.8, 0.15, 8, 48]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
      </TierGroup>
      
      <TierGroup active={tier === 2}>
         <mesh position={[0, 0.6, 0]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[6.8, 0.35, 12, 48]} />
          <meshStandardMaterial color={NAMAA.stone} roughness={0.8} />
        </mesh>
      </TierGroup>
      
      <TierGroup active={tier === 3}>
         <mesh position={[0, 0.8, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow castShadow>
          <torusGeometry args={[6.8, 0.5, 16, 48]} />
          <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.4, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[6.8, 0.15, 8, 48]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Guard Towers */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = i * Math.PI / 4;
          return (
            <group key={i} position={[Math.cos(angle) * 6.8, 1.4, Math.sin(angle) * 6.8]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.7, 0.8, 2.8, 12]} />
                <meshStandardMaterial color={NAMAA.stone} />
              </mesh>
              <mesh position={[0, 1.8, 0]}>
                <coneGeometry args={[0.9, 1.2, 6]} />
                <meshStandardMaterial color={NAMAA.purpleDeep} />
              </mesh>
            </group>
          )
        })}
      </TierGroup>
    </group>
  );
}
