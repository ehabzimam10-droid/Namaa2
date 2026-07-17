import React from 'react';
import * as THREE from 'three';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { KINGDOM } from './palette';
import { BuildingTooltip } from './BuildingTooltip';
import { useFrame } from '@react-three/fiber';

interface BuildingProps { level: number; tier: 1 | 2 | 3; }

/* ─────────────────────────── palette additions ──────────────────────────── */
const SEA   = '#1A7DA8';
const SEA2  = '#0D5E82';
const WOOD  = '#4A2E0F';
const WOOD2 = '#3D2010';
const PLANK = '#6B4226';
const ROPE  = '#8B7355';

/* ──────────────────────── shared helper components ─────────────────────── */

// /** Flat sea surface */
// function WaterPlane({ cx, cz, w, d }: { cx: number; cz: number; w: number; d: number }) {
//   return (
//     <mesh receiveShadow position={[cx, -0.06, cz]} rotation={[-Math.PI / 2, 0, 0]}>
//       <planeGeometry args={[w, d]} />
//       <meshStandardMaterial color={SEA} roughness={0.08} metalness={0.15}
//         transparent opacity={0.88} />
//     </mesh>
//   );
// }

/** Wooden mooring bollard */
function Bollard({ x, z, y = 0 }: { x: number; z: number; y?: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 1.1, 7]} />
        <meshStandardMaterial color={WOOD} roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.18, 7]} />
        <meshStandardMaterial color={WOOD2} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <torusGeometry args={[0.2, 0.045, 6, 16]} />
        <meshStandardMaterial color={ROPE} roughness={0.88} />
      </mesh>
    </group>
  );
}

/** Flagpole with banner */
function Flagpole({ x, z, y = 0, h = 3.5, color = KINGDOM.crimson }:
  { x: number; z: number; y?: number; h?: number; color?: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, h, 7]} />
        <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0.5, h - 0.5, 0]}>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, h + 0.18, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/** Lighthouse tower */
function Lighthouse({ x, z, y = 0, totalH = 6.0, r = 0.8 }:
  { x: number; z: number; y?: number; totalH?: number; r?: number }) {
  const shaftH = totalH * 0.7;
  return (
    <group position={[x, y, z]}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[r * 1.25, r * 1.4, 0.4, 10]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
      </mesh>
      {/* Main shaft */}
      <mesh castShadow receiveShadow position={[0, 0.4 + shaftH / 2, 0]}>
        <cylinderGeometry args={[r * 0.78, r, shaftH, 10]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
      </mesh>
      {/* Stripe bands */}
      {[0.3, 0.6].map((t, i) => (
        <mesh key={i} position={[0, 0.4 + shaftH * t, 0]}>
          <torusGeometry args={[r * 0.82, 0.1, 6, 22]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
        </mesh>
      ))}
      {/* Balcony */}
      <mesh castShadow receiveShadow position={[0, 0.4 + shaftH + 0.12, 0]}>
        <cylinderGeometry args={[r + 0.4, r + 0.25, 0.24, 12]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.55} />
      </mesh>
      {/* Lantern room */}
      <mesh castShadow receiveShadow position={[0, 0.4 + shaftH + 0.24 + totalH * 0.17 / 2, 0]}>
        <cylinderGeometry args={[r * 0.72, r * 0.8, totalH * 0.17, 10]} />
        <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow}
          emissiveIntensity={0.8} transparent opacity={0.82} />
      </mesh>
      {/* Cap cone */}
      <mesh castShadow position={[0, totalH + 0.18, 0]}>
        <coneGeometry args={[r * 0.8, totalH * 0.14, 10]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.6} />
      </mesh>
      {/* Spire */}
      <mesh castShadow position={[0, totalH + totalH * 0.14 + 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.11, 0.9, 7]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
      </mesh>
    </group>
  );
}

/** Cargo crane — post + horizontal arm + hook */
function Crane({ x, z, y = 0, h = 3.2, armL = 2.0, color = KINGDOM.stoneDark }:
  { x: number; z: number; y?: number; h?: number; armL?: number; color?: string }) {
  return (
    <group position={[x, y, z]}>
      {/* Base block */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.8} />
      </mesh>
      {/* Vertical post */}
      <mesh castShadow receiveShadow position={[0, 0.4 + h / 2, 0]}>
        <boxGeometry args={[0.28, h, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Horizontal arm */}
      <mesh castShadow receiveShadow position={[armL / 2, 0.4 + h, 0]}>
        <boxGeometry args={[armL, 0.2, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Cable */}
      <mesh castShadow position={[armL - 0.1, 0.4 + h - 0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 5]} />
        <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Hook */}
      <mesh castShadow position={[armL - 0.1, 0.4 + h - 1.85, 0]}>
        <torusGeometry args={[0.12, 0.04, 6, 12, Math.PI * 1.4]} />
        <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Counter weight */}
      <mesh castShadow position={[-0.35, 0.4 + h - 0.2, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Cargo barrel */
function Barrel({ x, z, y = 0 }: { x: number; z: number; y?: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.64, 9]} />
        <meshStandardMaterial color={PLANK} roughness={0.88} />
      </mesh>
      {[0.15, -0.15].map((dy, i) => (
        <mesh key={i} position={[0, 0.32 + dy, 0]}>
          <torusGeometry args={[0.29, 0.04, 5, 16]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Cargo crate */
function Crate({ x, z, y = 0, s = 0.6 }: { x: number; z: number; y?: number; s?: number }) {
  return (
    <group position={[x, y + s / 2, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[s, s, s]} />
        <meshStandardMaterial color={PLANK} roughness={0.85} />
      </mesh>
      {/* Cross straps */}
      <mesh position={[0, 0, s / 2 + 0.01]}>
        <boxGeometry args={[s + 0.02, 0.06, 0.04]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, s / 2 + 0.01]}>
        <boxGeometry args={[0.06, s + 0.02, 0.04]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Ship with a proper hull.
 * Default orientation: bow toward +Z (into the water), stern at -Z (at quay).
 * scale controls overall size; mastH is mast height at scale=1.
 */
function Ship({ scale = 1, sailColor = KINGDOM.white, mastCount = 1 }:
  { scale?: number; sailColor?: string; mastCount?: number }) {
  const W = 1.1 * scale;
  const H = 0.72 * scale;
  const L = 3.8 * scale;
  const mH = 4.2 * scale;
  const deckY = H * 0.56;
  const hullColor = WOOD2;

  return (
    <group>
      {/* ── Hull ── */}
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, H * 0.28, -L * 0.1]}>
        <boxGeometry args={[W, H * 0.56, L * 0.62]} />
        <meshStandardMaterial color={hullColor} roughness={0.88} />
      </mesh>
      {/* Bow cone (pointing +Z) */}
      <mesh castShadow position={[0, H * 0.28, L * 0.26]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[W / 2, L * 0.3, 8]} />
        <meshStandardMaterial color={hullColor} roughness={0.88} />
      </mesh>
      {/* Stern rounded back */}
      <mesh castShadow receiveShadow position={[0, H * 0.28, -L * 0.42]}>
        <boxGeometry args={[W * 0.72, H * 0.56, 0.12]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>

      {/* Gold waterline stripe */}
      <mesh position={[0, H * 0.56, -L * 0.1]}>
        <boxGeometry args={[W + 0.04, 0.06 * scale, L * 0.62]} />
        <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, H * 0.56, L * 0.26]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[W / 2 + 0.03, L * 0.3, 8]} />
        <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.72} roughness={0.28} />
      </mesh>

      {/* ── Deck ── */}
      <mesh castShadow receiveShadow position={[0, deckY + 0.04 * scale, -L * 0.1]}>
        <boxGeometry args={[W * 0.85, 0.07 * scale, L * 0.58]} />
        <meshStandardMaterial color={PLANK} roughness={0.82} />
      </mesh>

      {/* Bow deck extension */}
      <mesh castShadow receiveShadow position={[0, deckY + 0.03 * scale, L * 0.18]}>
        <boxGeometry args={[W * 0.55, 0.06 * scale, L * 0.18]} />
        <meshStandardMaterial color={PLANK} roughness={0.82} />
      </mesh>

      {/* ── Cabin / Bridge at stern ── */}
      <mesh castShadow receiveShadow position={[0, deckY + H * 0.3, -L * 0.3]}>
        <boxGeometry args={[W * 0.62, H * 0.5, L * 0.22]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      {/* Cabin windows */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} castShadow
          position={[s * W * 0.32, deckY + H * 0.31, -L * 0.24]}>
          <boxGeometry args={[0.1 * scale, 0.13 * scale, 0.05]} />
          <meshStandardMaterial color={KINGDOM.crystalGlow}
            emissive={KINGDOM.crystalGlow} emissiveIntensity={0.35} />
        </mesh>
      ))}
      {/* Cabin roof */}
      <mesh castShadow receiveShadow position={[0, deckY + H * 0.55, -L * 0.3]}>
        <boxGeometry args={[W * 0.65, 0.08 * scale, L * 0.24]} />
        <meshStandardMaterial color={WOOD2} roughness={0.82} />
      </mesh>

      {/* ── Mast(s) ── */}
      {Array.from({ length: mastCount }).map((_, mi) => {
        const mZ = mastCount === 1 ? 0 : mi === 0 ? L * 0.1 : -L * 0.12;
        return (
          <group key={mi}>
            <mesh castShadow position={[0, deckY + mH / 2, mZ]}>
              <cylinderGeometry args={[0.07 * scale, 0.1 * scale, mH, 7]} />
              <meshStandardMaterial color={WOOD2} roughness={0.9} />
            </mesh>
            {/* Boom */}
            <mesh castShadow
              position={[0, deckY + mH * 0.62, mZ]}
              rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04 * scale, 0.04 * scale, W * 0.92, 6]} />
              <meshStandardMaterial color={WOOD2} roughness={0.9} />
            </mesh>
            {/* Sail */}
            <mesh castShadow position={[0, deckY + mH * 0.42, mZ + 0.04]}>
              <boxGeometry args={[W * 0.75, mH * 0.44, 0.04]} />
              <meshStandardMaterial color={sailColor} transparent opacity={0.9}
                roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Flag at masthead */}
      <mesh castShadow position={[0.22 * scale, deckY + mH + 0.08, 0]}>
        <boxGeometry args={[0.38 * scale, 0.2 * scale, 0.03]} />
        <meshStandardMaterial color={KINGDOM.crimson} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Anchor at bow */}
      <mesh castShadow position={[0, H * 0.15, L * 0.38]}>
        <torusGeometry args={[0.14 * scale, 0.04 * scale, 6, 12]} />
        <meshStandardMaterial color={KINGDOM.stoneDark} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════ */
export function TradeHarbor({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useHoverLift(hovered);
  const water1Ref = React.useRef<THREE.Mesh>(null);
  const water2Ref = React.useRef<THREE.Mesh>(null);
  const water3Ref = React.useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Gentle shimmer by nudging emissive intensity — encoded as opacity oscillation
    [water1Ref, water2Ref, water3Ref].forEach((r, i) => {
      if (r.current) {
        (r.current.material as THREE.MeshStandardMaterial).opacity =
          0.82 + Math.sin(t * 0.7 + i) * 0.06;
      }
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.teal} />
      <BuildingTooltip buildingKey="harbor" level={level} visible={hovered}
        position={[0, tier === 3 ? 10 : tier === 2 ? 8 : 6, 0]} />

      {/* ══════════════════════════════════════
          TIER 1 — Small Wooden Dock
          One ship, quay edge, harbormaster hut,
          lighthouse, cargo corner.
          Footprint ≈ 5×5
         ══════════════════════════════════════ */}
      <TierGroup active={tier === 1}>
        {/* Sea water — front half */}
        <mesh ref={water1Ref} receiveShadow position={[0, -0.06, 2.0]}
          rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 2.5]} />
          <meshStandardMaterial color={SEA} roughness={0.08} metalness={0.15}
            transparent opacity={0.86} />
        </mesh>

        {/* Dock / quay platform */}
        <mesh castShadow receiveShadow position={[0, 0.2, -0.8]}>
          <boxGeometry args={[5.2, 0.4, 3.2]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.82} />
        </mesh>
        {/* Plank deck overlay */}
        <mesh receiveShadow position={[0, 0.42, -0.8]}>
          <boxGeometry args={[5.0, 0.05, 3.0]} />
          <meshStandardMaterial color={PLANK} roughness={0.85} />
        </mesh>

        {/* Quay edge stone lip */}
        <mesh castShadow receiveShadow position={[0, 0.38, 0.82]}>
          <boxGeometry args={[5.2, 0.3, 0.32]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.75} />
        </mesh>

        {/* Side quay walls */}
        {[-2.6, 2.6].map((x, i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 0.5, 1.4]}>
            <boxGeometry args={[0.3, 0.7, 1.5]} />
            <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
          </mesh>
        ))}

        {/* Harbourmaster hut */}
        <group position={[0, 0.42, -1.9]}>
          <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[2.6, 1.4, 1.2]} />
            <meshStandardMaterial color={KINGDOM.stone} roughness={0.78} />
          </mesh>
          {/* Pitched roof */}
          <mesh castShadow position={[0, 1.62, 0]}>
            <boxGeometry args={[2.8, 0.2, 1.4]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 2.0, 0]}>
            <boxGeometry args={[2.8, 0.18, 0.32]} />
            <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.78} />
          </mesh>
          {/* Door */}
          <mesh castShadow position={[0, 0.55, 0.62]}>
            <boxGeometry args={[0.55, 1.0, 0.1]} />
            <meshStandardMaterial color={WOOD} roughness={0.85} />
          </mesh>
          {/* Window */}
          <mesh castShadow position={[0.9, 0.78, 0.62]}>
            <boxGeometry args={[0.42, 0.42, 0.08]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Ship — bow toward +Z (sea) */}
        <group position={[0, 0, 1.8]}>
          <Ship scale={0.72} sailColor="#F8F4E8" />
        </group>

        {/* Bollards along quay */}
        <Bollard x={-1.4} z={0.7} y={0.4} />
        <Bollard x={ 0.0} z={0.7} y={0.4} />
        <Bollard x={ 1.4} z={0.7} y={0.4} />

        {/* Lighthouse */}
        <Lighthouse x={2.2} z={-1.8} y={0.42} totalH={4.2} r={0.55} />

        {/* Simple cargo corner */}
        <Barrel x={-1.8} z={-0.4} y={0.42} />
        <Barrel x={-1.3} z={-0.4} y={0.42} />
        <Crate x={-1.8} z={-1.0} y={0.42} s={0.5} />

        {/* Flagpole */}
        <Flagpole x={-2.2} z={-1.8} y={0.42} h={3.2} color={KINGDOM.crimson} />
      </TierGroup>

      {/* ══════════════════════════════════════
          TIER 2 — Royal Stone Quay
          U-shaped harbour walls, 2 ships,
          crane, lighthouse, cargo yard.
          Footprint ≈ 7×7
         ══════════════════════════════════════ */}
      <TierGroup active={tier === 2}>
        {/* Sea water basin */}
        <mesh ref={water2Ref} receiveShadow position={[0, -0.07, 2.4]}
          rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.2, 3.2]} />
          <meshStandardMaterial color={SEA} roughness={0.07} metalness={0.18}
            transparent opacity={0.88} />
        </mesh>

        {/* Main dock platform */}
        <mesh castShadow receiveShadow position={[0, 0.22, -1.0]}>
          <boxGeometry args={[7.2, 0.44, 4.8]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.78} />
        </mesh>
        {/* Plank overlay */}
        <mesh receiveShadow position={[0, 0.46, -1.0]}>
          <boxGeometry args={[7.0, 0.06, 4.6]} />
          <meshStandardMaterial color={PLANK} roughness={0.82} />
        </mesh>

        {/* Quay front lip */}
        <mesh castShadow receiveShadow position={[0, 0.55, 1.32]}>
          <boxGeometry args={[7.2, 0.5, 0.36]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.75} />
        </mesh>

        {/* U-shape: left wall */}
        <mesh castShadow receiveShadow position={[-3.6, 0.7, 1.8]}>
          <boxGeometry args={[0.4, 1.1, 2.8]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>
        {/* U-shape: right wall */}
        <mesh castShadow receiveShadow position={[3.6, 0.7, 1.8]}>
          <boxGeometry args={[0.4, 1.1, 2.8]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>

        {/* Gold quay edge strip */}
        <mesh position={[0, 0.82, 1.32]}>
          <boxGeometry args={[7.2, 0.1, 0.36]} />
          <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.78} roughness={0.22} />
        </mesh>

        {/* Harbourmaster building */}
        <group position={[0, 0.46, -2.9]}>
          {/* Main hall */}
          <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
            <boxGeometry args={[5.0, 3.0, 1.6]} />
            <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
          </mesh>
          {/* Front colonnade: 4 columns */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <group key={i} position={[x, 0, 0.92]}>
              <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.2, 0.25, 3.0, 8]} />
                <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 3.1, 0]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
              </mesh>
            </group>
          ))}
          {/* Entablature */}
          <mesh castShadow receiveShadow position={[0, 3.45, 0.92]}>
            <boxGeometry args={[5.2, 0.38, 1.0]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.55} />
          </mesh>
          <mesh position={[0, 3.66, 0.92]}>
            <boxGeometry args={[5.2, 0.1, 1.0]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Roof */}
          <mesh castShadow receiveShadow position={[0, 3.72, 0]}>
            <boxGeometry args={[5.2, 0.28, 1.8]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
          </mesh>
          {/* Windows */}
          {[-1.6, 0, 1.6].map((x, i) => (
            <mesh key={i} castShadow position={[x, 1.7, 0.86]}>
              <boxGeometry args={[0.7, 0.9, 0.1]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.3} />
            </mesh>
          ))}
          {/* Door */}
          <mesh castShadow position={[0, 1.1, 0.86]}>
            <boxGeometry args={[0.9, 2.0, 0.1]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.65} roughness={0.35} />
          </mesh>
        </group>

        {/* 2 ships */}
        <group position={[-2.0, 0, 2.5]}>
          <Ship scale={0.85} sailColor="#F5EDD5" mastCount={1} />
        </group>
        <group position={[2.0, 0, 2.5]}>
          <Ship scale={0.78} sailColor={KINGDOM.white} mastCount={1} />
        </group>

        {/* Bollards */}
        {[-3.0, -1.5, 0, 1.5, 3.0].map((x, i) => (
          <Bollard key={i} x={x} z={1.2} y={0.44} />
        ))}

        {/* Lighthouse (left rear) */}
        <Lighthouse x={-3.2} z={-3.0} y={0.44} totalH={6.5} r={0.72} />

        {/* Cargo crane (right dock area) */}
        <Crane x={2.6} z={0.2} y={0.44} h={3.0} armL={1.8} />

        {/* Cargo area */}
        <Barrel x={-2.4} z={-0.2} y={0.44} />
        <Barrel x={-1.9} z={-0.2} y={0.44} />
        <Barrel x={-2.15} z={0.4} y={0.44} />
        <Crate  x={-2.4}  z={0.8} y={0.44} s={0.55} />
        <Crate  x={-1.8}  z={0.8} y={0.44} s={0.55} />
        <Crate  x={-2.1}  z={1.35} y={0.44 + 0.55} s={0.55} />

        {/* Flagpoles */}
        <Flagpole x={-3.1} z={ 0.5} y={0.44} h={4.0} color={KINGDOM.crimson} />
        <Flagpole x={ 3.1} z={-2.8} y={0.44} h={3.2} color={KINGDOM.gold} />
      </TierGroup>

      {/* ══════════════════════════════════════
          TIER 3 — Grand Royal Harbor
          Full breakwater, grand building,
          tall lighthouse, 3 ships, 2 cranes,
          cargo yard, watch towers.
          Footprint ≈ 9×9
         ══════════════════════════════════════ */}
      <TierGroup active={tier === 3}>
        {/* Sea water basin */}
        <mesh ref={water3Ref} receiveShadow position={[0, -0.08, 3.0]}
          rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9.5, 4.5]} />
          <meshStandardMaterial color={SEA2} roughness={0.06} metalness={0.2}
            transparent opacity={0.9} />
        </mesh>
        {/* Water ripple overlay */}
        <mesh receiveShadow position={[0, -0.05, 3.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9.0, 4.0]} />
          <meshStandardMaterial color={SEA} roughness={0.05} metalness={0.25}
            transparent opacity={0.45} />
        </mesh>

        {/* Main dock platform */}
        <mesh castShadow receiveShadow position={[0, 0.27, -1.0]}>
          <boxGeometry args={[9.5, 0.54, 6.5]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.75} />
        </mesh>
        {/* Marble deck overlay */}
        <mesh receiveShadow position={[0, 0.56, -1.0]}>
          <boxGeometry args={[9.3, 0.07, 6.3]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.55} />
        </mesh>

        {/* Quay front lip */}
        <mesh castShadow receiveShadow position={[0, 0.68, 1.6]}>
          <boxGeometry args={[9.5, 0.6, 0.44]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.72} />
        </mesh>
        {/* Gold edge on quay */}
        <mesh position={[0, 1.0, 1.6]}>
          <boxGeometry args={[9.5, 0.12, 0.44]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.82} roughness={0.18} />
        </mesh>

        {/* ── U-Shaped Breakwater ── */}
        {/* Left breakwater arm */}
        <mesh castShadow receiveShadow position={[-4.75, 1.0, 2.6]}>
          <boxGeometry args={[0.5, 1.5, 3.5]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.82} />
        </mesh>
        {/* Right breakwater arm */}
        <mesh castShadow receiveShadow position={[4.75, 1.0, 2.6]}>
          <boxGeometry args={[0.5, 1.5, 3.5]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.82} />
        </mesh>
        {/* Breakwater merlons (left) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} castShadow position={[-4.75, 1.88, 1.0 + i * 0.7]}>
            <boxGeometry args={[0.55, 0.5, 0.3]} />
            <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.85} />
          </mesh>
        ))}
        {/* Breakwater merlons (right) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} castShadow position={[4.75, 1.88, 1.0 + i * 0.7]}>
            <boxGeometry args={[0.55, 0.5, 0.3]} />
            <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.85} />
          </mesh>
        ))}

        {/* Harbour entrance pillars */}
        {[-4.1, 4.1].map((x, i) => (
          <group key={i} position={[x, 0.54, 4.2]}>
            <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.32, 0.42, 3.6, 10]} />
              <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3.7, 0]}>
              <sphereGeometry args={[0.48, 12, 12]} />
              <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1}
                emissive={KINGDOM.goldGlow} emissiveIntensity={0.35} />
            </mesh>
          </group>
        ))}

        {/* ── Grand Harbourmaster Building ── */}
        <group position={[0, 0.56, -3.5]}>
          {/* Main hall */}
          <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
            <boxGeometry args={[7.0, 4.4, 2.2]} />
            <meshStandardMaterial color={KINGDOM.marble} roughness={0.44} />
          </mesh>
          {/* Side wings */}
          {[-3.8, 3.8].map((x, i) => (
            <mesh key={i} castShadow receiveShadow position={[x, 1.5, 0]}>
              <boxGeometry args={[1.5, 3.0, 2.2]} />
              <meshStandardMaterial color={KINGDOM.marble} roughness={0.46} />
            </mesh>
          ))}
          {/* 6-column colonnade */}
          {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
            <group key={i} position={[x, 0, 1.3]}>
              <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
                <cylinderGeometry args={[0.24, 0.3, 4.4, 9]} />
                <meshStandardMaterial color={KINGDOM.marble} roughness={0.43} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
                <boxGeometry args={[0.62, 0.38, 0.62]} />
                <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
              </mesh>
            </group>
          ))}
          {/* Grand entablature */}
          <mesh castShadow receiveShadow position={[0, 4.95, 1.3]}>
            <boxGeometry args={[7.2, 0.52, 1.2]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.52} />
          </mesh>
          <mesh position={[0, 5.25, 1.3]}>
            <boxGeometry args={[7.2, 0.12, 1.2]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.82} roughness={0.18} />
          </mesh>
          {/* Roof with small dome */}
          <mesh castShadow receiveShadow position={[0, 5.45, 0]}>
            <boxGeometry args={[7.2, 0.34, 2.4]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.62} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 6.1, -0.4]}>
            <sphereGeometry args={[1.05, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={KINGDOM.teal} metalness={0.5} roughness={0.38} />
          </mesh>
          <mesh castShadow position={[0, 7.18, -0.4]}>
            <cylinderGeometry args={[0.06, 0.16, 1.1, 8]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
          </mesh>
          <mesh castShadow position={[0, 7.74, -0.4]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.95}
              emissive={KINGDOM.goldGlow} emissiveIntensity={0.4} />
          </mesh>
          {/* Windows */}
          {[-2.2, 0, 2.2].map((x, i) => (
            <mesh key={i} castShadow position={[x, 2.4, 1.18]}>
              <boxGeometry args={[0.85, 1.1, 0.1]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.4} />
            </mesh>
          ))}
          {/* Grand door */}
          <mesh castShadow position={[0, 1.6, 1.18]}>
            <boxGeometry args={[1.4, 2.8, 0.12]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* ── Grand Lighthouse (left rear) ── */}
        <Lighthouse x={-4.1} z={-4.0} y={0.56} totalH={9.0} r={0.95} />

        {/* ── Smaller lighthouse (right breakwater tip) ── */}
        <Lighthouse x={4.5} z={4.1} y={0.56} totalH={5.2} r={0.6} />

        {/* ── 3 Ships ── */}
        {/* Large ship — centre */}
        <group position={[0, 0, 3.2]}>
          <Ship scale={1.05} sailColor="#F8F2E2" mastCount={2} />
        </group>
        {/* Medium ship — left */}
        <group position={[-3.0, 0, 3.0]}>
          <Ship scale={0.82} sailColor={KINGDOM.white} mastCount={1} />
        </group>
        {/* Small ship — right */}
        <group position={[3.0, 0, 2.9]}>
          <Ship scale={0.68} sailColor="#EEF4F8" mastCount={1} />
        </group>

        {/* Bollards along quay */}
        {[-4.0, -2.6, -1.2, 0, 1.2, 2.6, 4.0].map((x, i) => (
          <Bollard key={i} x={x} z={1.5} y={0.56} />
        ))}

        {/* ── 2 Cargo Cranes ── */}
        <Crane x={2.8}  z={0.5}  y={0.56} h={4.0} armL={2.2} />
        <Crane x={-3.2} z={0.3}  y={0.56} h={3.5} armL={-2.0} />

        {/* ── Cargo Yard (right side) ── */}
        {[[1.8, -0.3],[2.4,-0.3],[3.0,-0.3],[1.8,0.4],[2.4,0.4],[2.1,1.0]].map(([x,z],i)=>(
          <Barrel key={`b${i}`} x={x} z={z} y={0.56} />
        ))}
        {[[1.6,-1.0],[2.3,-1.0],[3.0,-1.0],[1.6,-1.65],[2.3,-1.65]].map(([x,z],i)=>(
          <Crate key={`c${i}`} x={x} z={z} y={0.56} s={0.58} />
        ))}
        {/* Stacked crates */}
        <Crate x={2.3} z={-1.0} y={0.56 + 0.58} s={0.58} />

        {/* Cargo yard — left side (barrels near crane) */}
        {[[-2.6,-0.5],[-3.2,-0.5],[-2.9,0.1]].map(([x,z],i)=>(
          <Barrel key={`bl${i}`} x={x} z={z} y={0.56} />
        ))}

        {/* ── Flagpoles ── */}
        <Flagpole x={-4.4} z={ 1.2} y={0.56} h={5.0} color={KINGDOM.crimson} />
        <Flagpole x={ 4.4} z={ 1.2} y={0.56} h={5.0} color={KINGDOM.royalRed} />
        <Flagpole x={-4.4} z={-1.5} y={0.56} h={3.8} color={KINGDOM.gold} />

        {/* Floating harbour marker buoy */}
        <Floating height={0.12} speed={1.2} yOffset={0.2}>
          <group position={[0, 0, 5.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.28, 0.55, 8]} />
              <meshStandardMaterial color={KINGDOM.crimson} roughness={0.7} />
            </mesh>
            <mesh castShadow position={[0, 0.56, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 1.1, 6]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh castShadow position={[0, 1.18, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1}
                emissive={KINGDOM.goldGlow} emissiveIntensity={0.5} />
            </mesh>
          </group>
        </Floating>
      </TierGroup>
    </group>
  );
}
