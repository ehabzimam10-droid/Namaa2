import React from 'react';
import * as THREE from 'three';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';
import { useFrame } from '@react-three/fiber';

interface BuildingProps {
  level: number;
  tier: 1 | 2 | 3;
}

/** Decorative balcony ring */
function Balcony({ y, r }: { y: number; r: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r + 0.5, r + 0.28, 0.26, 16]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[r + 0.5, 0.09, 6, 32]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * (r + 0.5), 0.36, Math.sin(a) * (r + 0.5)]}>
            <cylinderGeometry args={[0.055, 0.055, 0.5, 6]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.75} />
          </mesh>
        );
      })}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * (r + 0.02), -0.55, Math.sin(a) * (r + 0.02)]}>
            <boxGeometry args={[0.5, 0.82, 0.09]} />
            <meshStandardMaterial color={KINGDOM.crystal} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.3} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function Band({ y, r, color = KINGDOM.gold }: { y: number; r: number; color?: string }) {
  return (
    <mesh position={[0, y, 0]}>
      <torusGeometry args={[r + 0.04, 0.12, 6, 32]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.2} />
    </mesh>
  );
}

export function WisdomTower({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef   = useHoverLift(hovered);
  const orbRingRef = React.useRef<THREE.Mesh>(null);
  const orbRing2   = React.useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (orbRingRef.current) {
      orbRingRef.current.rotation.x = t * 0.9;
      orbRingRef.current.rotation.z = t * 0.5;
    }
    if (orbRing2.current) {
      orbRing2.current.rotation.y = t * 1.2;
      orbRing2.current.rotation.x = t * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.purpleBright} />
      <BuildingTooltip
        buildingKey="tower"
        level={level}
        visible={hovered}
        position={[0, tier === 3 ? 13 : tier === 2 ? 9 : 5, 0]}
      />

      {/* ══ TIER 1 — Watch Tower  (total ≈ 7.5 units) ══ */}
      <TierGroup active={tier === 1}>
        {/* Octagonal base */}
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[2.0, 2.3, 0.36, 8]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>

        {/* Shaft */}
        <mesh castShadow receiveShadow position={[0, 2.05, 0]}>
          <cylinderGeometry args={[1.35, 1.7, 3.5, 10]} />
          <meshStandardMaterial color={KINGDOM.stone} roughness={0.75} />
        </mesh>
        <Band y={2.2} r={1.5} />

        {/* Arrow slits */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 1.66, 2.3, Math.sin(a) * 1.66]}>
              <boxGeometry args={[0.2, 0.85, 0.11]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.4} />
            </mesh>
          );
        })}

        {/* Battlement ring */}
        <mesh castShadow receiveShadow position={[0, 3.98, 0]}>
          <cylinderGeometry args={[1.54, 1.42, 0.5, 10]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 1.46, 4.45, Math.sin(a) * 1.46]}>
              <boxGeometry args={[0.38, 0.5, 0.38]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
            </mesh>
          );
        })}

        {/* Conical roof */}
        <mesh castShadow position={[0, 5.05, 0]}>
          <coneGeometry args={[1.62, 2.1, 10]} />
          <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.55} />
        </mesh>
        {/* Gold spire */}
        <mesh castShadow position={[0, 6.18, 0]}>
          <cylinderGeometry args={[0.055, 0.16, 1.05, 8]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 6.73, 0]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} emissive={KINGDOM.goldGlow} emissiveIntensity={0.4} />
        </mesh>

        {/* Small floating orb */}
        <Floating height={0.17} speed={2.2} yOffset={7.5}>
          <mesh>
            <sphereGeometry args={[0.3, 14, 14]} />
            <meshStandardMaterial color={KINGDOM.purpleBright} emissive={KINGDOM.purpleBright} emissiveIntensity={1.0} />
          </mesh>
        </Floating>
      </TierGroup>

      {/* ══ TIER 2 — Grand Library Tower  (total ≈ 13 units) ══ */}
      <TierGroup active={tier === 2}>
        {/* Octagonal base */}
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <cylinderGeometry args={[2.7, 3.1, 0.44, 8]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[2.7, 0.11, 6, 32]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Lower shaft  (y 0.44 → 3.64, centre 2.04) */}
        <mesh castShadow receiveShadow position={[0, 2.04, 0]}>
          <cylinderGeometry args={[1.92, 2.4, 3.2, 12]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
        </mesh>
        <Band y={1.1} r={2.15} />
        <Band y={3.5} r={1.92} />

        {/* First balcony */}
        <Balcony y={3.72} r={1.92} />

        {/* Middle shaft  (top of balcony ≈ 4.1 → 7.1, centre 5.6) */}
        <mesh castShadow receiveShadow position={[0, 5.62, 0]}>
          <cylinderGeometry args={[1.5, 1.96, 3.4, 12]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
        </mesh>
        <Band y={4.55} r={1.74} />
        <Band y={7.1} r={1.5} />

        {/* Second balcony */}
        <Balcony y={7.32} r={1.5} />

        {/* Upper shaft  (7.7 → 9.9, centre 8.8) */}
        <mesh castShadow receiveShadow position={[0, 8.8, 0]}>
          <cylinderGeometry args={[1.0, 1.54, 2.2, 12]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>

        {/* Battlement ring */}
        <mesh castShadow receiveShadow position={[0, 9.95, 0]}>
          <cylinderGeometry args={[1.15, 1.05, 0.55, 12]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.75} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 1.08, 10.42, Math.sin(a) * 1.08]}>
              <boxGeometry args={[0.34, 0.48, 0.34]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.75} />
            </mesh>
          );
        })}

        {/* Pointed roof */}
        <mesh castShadow position={[0, 11.4, 0]}>
          <coneGeometry args={[1.28, 2.8, 12]} />
          <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.55} />
        </mesh>
        {/* Gold spire */}
        <mesh castShadow position={[0, 12.88, 0]}>
          <cylinderGeometry args={[0.065, 0.2, 1.6, 8]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 13.73, 0]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.92} roughness={0.08}
            emissive={KINGDOM.goldGlow} emissiveIntensity={0.4} />
        </mesh>

        {/* Floating orb */}
        <Floating height={0.25} speed={1.8} yOffset={14.8}>
          <mesh>
            <sphereGeometry args={[0.48, 18, 18]} />
            <meshStandardMaterial color={KINGDOM.purpleBright} emissive={KINGDOM.purpleBright} emissiveIntensity={1.1} />
          </mesh>
          <mesh ref={orbRingRef}>
            <torusGeometry args={[0.82, 0.065, 8, 28]} />
            <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.7} />
          </mesh>
        </Floating>
      </TierGroup>

      {/* ══ TIER 3 — Grand Arcane Minaret  (total ≈ 20 units) ══ */}
      <TierGroup active={tier === 3}>
        {/* Wide octagonal base */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[3.4, 4.0, 0.6, 8]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <torusGeometry args={[3.4, 0.16, 8, 32]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* ── Section 1  (0.6 → 4.6, centre 2.6, h 4.0) ── */}
        <mesh castShadow receiveShadow position={[0, 2.6, 0]}>
          <cylinderGeometry args={[2.6, 3.2, 4.0, 14]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
        </mesh>
        <Band y={1.2} r={2.9} />
        <Band y={4.4} r={2.6} />

        {/* Arrow slits lower */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 2.62, 2.9, Math.sin(a) * 2.62]}>
              <boxGeometry args={[0.28, 1.1, 0.11]} />
              <meshStandardMaterial color={KINGDOM.crystal} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} />
            </mesh>
          );
        })}

        {/* First balcony */}
        <Balcony y={4.68} r={2.6} />

        {/* ── Section 2  (5.1 → 9.6, centre 7.35, h 4.5) ── */}
        <mesh castShadow receiveShadow position={[0, 7.35, 0]}>
          <cylinderGeometry args={[2.0, 2.55, 4.5, 14]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.4} />
        </mesh>
        <Band y={5.6} r={2.3} />
        <Band y={9.4} r={2.0} />

        {/* Windows mid */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 2.02, 7.5, Math.sin(a) * 2.02]}>
              <boxGeometry args={[0.34, 1.3, 0.11]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.55} />
            </mesh>
          );
        })}

        {/* Second balcony */}
        <Balcony y={9.65} r={2.0} />

        {/* ── Section 3  (10.1 → 14.1, centre 12.1, h 4.0) ── */}
        <mesh castShadow receiveShadow position={[0, 12.1, 0]}>
          <cylinderGeometry args={[1.45, 1.95, 4.0, 14]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.42} />
        </mesh>
        <Band y={10.5} r={1.72} />
        <Band y={13.9} r={1.45} color={KINGDOM.goldDeep} />

        {/* Upper windows */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 1.47, 12.2, Math.sin(a) * 1.47]}>
              <boxGeometry args={[0.29, 1.1, 0.1]} />
              <meshStandardMaterial color={KINGDOM.purpleBright} emissive={KINGDOM.purpleBright} emissiveIntensity={0.6} />
            </mesh>
          );
        })}

        {/* Third balcony — observation deck */}
        <Balcony y={14.2} r={1.45} />

        {/* ── Cap shaft  (14.65 → 16.85, centre 15.75, h 2.2) ── */}
        <mesh castShadow receiveShadow position={[0, 15.75, 0]}>
          <cylinderGeometry args={[0.82, 1.45, 2.2, 14]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.45} />
        </mesh>

        {/* Dome cap  (sits at y=16.85) */}
        <mesh castShadow receiveShadow position={[0, 16.85, 0]}>
          <sphereGeometry args={[0.95, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.42} metalness={0.22} />
        </mesh>
        <mesh position={[0, 16.85, 0]}>
          <torusGeometry args={[0.96, 0.13, 8, 32]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Spire */}
        <mesh castShadow position={[0, 18.1, 0]}>
          <cylinderGeometry args={[0.055, 0.2, 2.4, 10]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh castShadow position={[0, 19.35, 0]}>
          <sphereGeometry args={[0.36, 12, 12]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05}
            emissive={KINGDOM.goldGlow} emissiveIntensity={0.55} />
        </mesh>

        {/* Grand floating magic orb */}
        <Floating height={0.42} speed={1.4} yOffset={21.0}>
          <mesh>
            <sphereGeometry args={[0.78, 22, 22]} />
            <meshStandardMaterial color={KINGDOM.purpleBright} emissive={KINGDOM.purpleBright}
              emissiveIntensity={1.4} transparent opacity={0.92} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.56, 14, 14]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow}
              emissiveIntensity={1.2} transparent opacity={0.52} />
          </mesh>
          <mesh ref={orbRingRef}>
            <torusGeometry args={[1.32, 0.09, 8, 36]} />
            <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.9} />
          </mesh>
          <mesh ref={orbRing2} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.32, 0.065, 8, 36]} />
            <meshStandardMaterial color={KINGDOM.crystal} emissive={KINGDOM.crystal} emissiveIntensity={0.7} />
          </mesh>
        </Floating>

        {/* Orbital sparks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Floating key={i} height={0.3} speed={1.1 + i * 0.11} yOffset={18.5 + (i % 4) * 0.65}>
              <mesh position={[Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? KINGDOM.goldGlow : KINGDOM.purpleBright}
                  emissive={i % 2 === 0 ? KINGDOM.goldGlow : KINGDOM.purpleBright}
                  emissiveIntensity={1.2}
                />
              </mesh>
            </Floating>
          );
        })}
      </TierGroup>
    </group>
  );
}
