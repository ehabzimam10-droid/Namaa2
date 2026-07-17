import React from 'react';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

/** Classical column */
function Column({ x, z, h, r, y = 0 }: { x: number; z: number; h: number; r: number; y?: number }) {
  return (
    <group position={[x, y, z]}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[r * 2.6, 0.3, r * 2.6]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
      </mesh>
      {/* Shaft */}
      <mesh castShadow receiveShadow position={[0, h / 2 + 0.3, 0]}>
        <cylinderGeometry args={[r * 0.85, r, h, 10]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
      </mesh>
      {/* Capital */}
      <mesh castShadow receiveShadow position={[0, h + 0.3 + 0.2, 0]}>
        <boxGeometry args={[r * 2.8, 0.4, r * 2.8]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Triangular pediment (gable) */
function Pediment({ w, d, h, y, goldTrim = false }: { w: number; d: number; h: number; y: number; goldTrim?: boolean }) {
  // built from 3 boxes to form a triangle silhouette
  const segments = 6;
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: segments }).map((_, i) => {
        const t     = i / (segments - 1);           // 0 → 1
        const sliceH = 0.22;
        const sliceW = w * (1 - t);                 // narrows toward apex
        const sliceY = t * h;
        return (
          <mesh key={i} castShadow receiveShadow position={[0, sliceY + sliceH / 2, 0]}>
            <boxGeometry args={[sliceW, sliceH + 0.01, d]} />
            <meshStandardMaterial color={goldTrim ? KINGDOM.marbleDark : KINGDOM.marble} roughness={0.45} />
          </mesh>
        );
      })}
      {/* Gold ridge */}
      {goldTrim && (
        <mesh position={[0, h + 0.12, 0]}>
          <boxGeometry args={[0.35, 0.25, d + 0.1]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>
      )}
    </group>
  );
}

/** Vault door */
function VaultDoor({ scale = 1 }: { scale?: number }) {
  return (
    <group>
      {/* Frame */}
      <mesh castShadow position={[0, scale * 0.9, 0]}>
        <boxGeometry args={[scale * 1.6, scale * 1.8, scale * 0.12]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
      </mesh>
      {/* Door face */}
      <mesh castShadow position={[0, scale * 0.9, scale * 0.07]}>
        <boxGeometry args={[scale * 1.2, scale * 1.4, scale * 0.1]} />
        <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Circular lock */}
      <mesh castShadow position={[0, scale * 0.9, scale * 0.13]}>
        <cylinderGeometry args={[scale * 0.28, scale * 0.28, scale * 0.06, 12]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[scale * 0.38, scale * 0.9, scale * 0.14]}>
        <sphereGeometry args={[scale * 0.1, 8, 8]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function Treasury({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef  = useHoverLift(hovered);
  const coinsRef  = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tier === 3 && coinsRef.current) {
      coinsRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.gold} />
      <BuildingTooltip
        buildingKey="treasury"
        level={level}
        visible={hovered}
        position={[0, tier === 3 ? 10 : tier === 2 ? 7 : 5, 0]}
      />

      {/* ─── Tier 1: Small stone bank vault ─── */}
      <TierGroup active={tier === 1}>
        {/* Steps */}
        <mesh castShadow receiveShadow position={[0, 0.1, 1.6]}>
          <boxGeometry args={[3.2, 0.2, 0.7]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.3, 1.3]}>
          <boxGeometry args={[3.0, 0.2, 0.6]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>

        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[3.5, 2.6, 3]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
        </mesh>

        {/* Two front columns */}
        <Column x={-0.9} z={1.5} h={2.4} r={0.22} />
        <Column x={ 0.9} z={1.5} h={2.4} r={0.22} />

        {/* Entablature */}
        <mesh castShadow receiveShadow position={[0, 3.1, 0.8]}>
          <boxGeometry args={[3.6, 0.35, 1.4]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.55} />
        </mesh>

        {/* Pediment */}
        <Pediment w={3.5} d={1.3} h={0.9} y={3.45} />

        {/* Vault door */}
        <group position={[0, 0, 1.51]}>
          <VaultDoor scale={0.9} />
        </group>

        {/* Coin above */}
        <Floating height={0.2} speed={1.8} yOffset={4.2}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
          </mesh>
        </Floating>
      </TierGroup>

      {/* ─── Tier 2: Grand treasury hall ─── */}
      <TierGroup active={tier === 2}>
        {/* Three-step platform */}
        {[0, 1, 2].map((s) => (
          <mesh key={s} castShadow receiveShadow position={[0, s * 0.22 + 0.11, 2.2 - s * 0.35]}>
            <boxGeometry args={[5.4 - s * 0.3, 0.22, 0.8]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
          </mesh>
        ))}

        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[5.5, 4.3, 4.5]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
        </mesh>

        {/* Four front columns */}
        {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
          <Column key={i} x={x} z={2.3} h={3.8} r={0.28} />
        ))}

        {/* Entablature */}
        <mesh castShadow receiveShadow position={[0, 4.75, 1.3]}>
          <boxGeometry args={[5.6, 0.45, 2]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
        {/* Gold trim on entablature */}
        <mesh position={[0, 4.99, 1.3]}>
          <boxGeometry args={[5.6, 0.08, 2]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.75} roughness={0.2} />
        </mesh>

        {/* Pediment */}
        <Pediment w={5.5} d={1.9} h={1.2} y={5.2} goldTrim />

        {/* Side pilasters (decorative) */}
        {[-2.76, 2.76].map((x, i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 2.5, 0]}>
            <boxGeometry args={[0.28, 4.3, 0.28]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.55} />
          </mesh>
        ))}

        {/* Windows on sides */}
        {[-1.2, 1.2].map((z, i) => (
          <mesh key={i} castShadow position={[2.76, 2.5, z]}>
            <boxGeometry args={[0.08, 1.2, 0.9]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Vault door */}
        <group position={[0, 0.66, 2.26]}>
          <VaultDoor scale={1.1} />
        </group>

        {/* Golden dome on top */}
        <mesh castShadow receiveShadow position={[0, 6.6, 0]}>
          <sphereGeometry args={[1.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 7.9, 0]}>
          <cylinderGeometry args={[0.07, 0.15, 1.8, 8]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.8} />
        </mesh>

        {/* Floating coin stack */}
        <Floating height={0.3} speed={1.6} yOffset={9}>
          {[0, 0.12, 0.24].map((y, i) => (
            <mesh key={i} castShadow position={[0, y, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
              <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
            </mesh>
          ))}
        </Floating>
      </TierGroup>

      {/* ─── Tier 3: Grand Royal Treasury ─── */}
      <TierGroup active={tier === 3}>
        {/* Wide raised platform — 4 steps */}
        {[0, 1, 2, 3].map((s) => (
          <mesh key={s} castShadow receiveShadow position={[0, s * 0.28 + 0.14, 3 - s * 0.45]}>
            <boxGeometry args={[8 - s * 0.35, 0.28, 1.1]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
          </mesh>
        ))}

        {/* Grand main body */}
        <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
          <boxGeometry args={[8, 5.5, 7]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.4} />
        </mesh>

        {/* Six front columns */}
        {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x, i) => (
          <Column key={i} x={x} z={3.6} h={5.2} r={0.35} y={1.12} />
        ))}

        {/* Two rear columns (visible from sides) */}
        {[-3, 3].map((x, i) => (
          <Column key={i} x={x} z={-3.5} h={5.2} r={0.35} y={1.12} />
        ))}

        {/* Entablature */}
        <mesh castShadow receiveShadow position={[0, 6.98, 1.8]}>
          <boxGeometry args={[8.2, 0.55, 3.6]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.48} />
        </mesh>
        {/* Gold entablature trim */}
        <mesh position={[0, 7.27, 1.8]}>
          <boxGeometry args={[8.2, 0.1, 3.6]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Grand pediment */}
        <Pediment w={8} d={3.5} h={1.6} y={7.55} goldTrim />

        {/* Side pilasters */}
        {[-4.01, 4.01].map((x, i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 3.5, 0]}>
            <boxGeometry args={[0.35, 5.5, 0.35]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
          </mesh>
        ))}

        {/* Arched windows on sides */}
        {[-1.8, 0, 1.8].map((z, i) => (
          <mesh key={i} castShadow position={[4.01, 3.5, z]}>
            <boxGeometry args={[0.1, 1.8, 1.1]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.65} roughness={0.25} />
          </mesh>
        ))}

        {/* Grand dome on top */}
        <mesh castShadow receiveShadow position={[0, 9.3, 0]}>
          <sphereGeometry args={[2.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.92} roughness={0.08} />
        </mesh>
        {/* Dome drum */}
        <mesh castShadow receiveShadow position={[0, 8.2, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.8, 24]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
        {/* Gold band on drum */}
        <mesh position={[0, 8.65, 0]}>
          <torusGeometry args={[2.32, 0.1, 8, 32]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Lantern spire */}
        <mesh castShadow position={[0, 11.5, 0]}>
          <cylinderGeometry args={[0.08, 0.2, 2.8, 8]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 12.95, 0]}>
          <sphereGeometry args={[0.28, 10, 10]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05} emissive={KINGDOM.goldGlow} emissiveIntensity={0.3} />
        </mesh>

        {/* Grand vault door */}
        <group position={[0, 1.12, 3.61]}>
          <VaultDoor scale={1.5} />
        </group>

        {/* Rotating coin ring */}
        <group ref={coinsRef} position={[0, 11, 0]}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <mesh key={i} castShadow position={[Math.cos(a) * 2.8, 0, Math.sin(a) * 2.8]} rotation={[Math.PI / 2, 0, a]}>
                <cylinderGeometry args={[0.42, 0.42, 0.07, 16]} />
                <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} emissive={KINGDOM.goldGlow} emissiveIntensity={0.25} />
              </mesh>
            );
          })}
        </group>

        {/* Floating coin stack */}
        <Floating height={0.4} speed={1.4} yOffset={13.5}>
          {[0, 0.14, 0.28, 0.42].map((y, i) => (
            <mesh key={i} castShadow position={[0, y, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 0.12, 16]} />
              <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} emissive={KINGDOM.goldGlow} emissiveIntensity={0.15} />
            </mesh>
          ))}
        </Floating>
      </TierGroup>
    </group>
  );
}
