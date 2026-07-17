import { useMemo } from 'react';
import * as THREE from 'three';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup } from './utils';

const R = 18;                  // wall radius
const GATE_HALF_ANGLE = 0.21;  // radians — zone cleared for the gate (~3 segments at N=56)

// Arch rotation: makes a half-torus span the Z axis and arch up in Y
const ARCH_ROT: [number, number, number] = [-Math.PI / 2, Math.PI / 2, 0];

// Gate arc geometry constants (cylinder theta space: phi=0 → +Z, phi=π/2 → +X)
// Gate is at +X in world → phi = π/2. We leave a gap from π/2 ± GATE_HALF_ANGLE.
const WALL_THETA_START = Math.PI / 2 + GATE_HALF_ANGLE;
const WALL_ARC_LEN     = Math.PI * 2 - GATE_HALF_ANGLE * 2;

/**
 * One seamless wall-ring arc — a CylinderGeometry with a gate gap.
 * No per-segment joints → truly one solid piece per course.
 */
function WallArc({ yBot, h, color, rOff = 0 }: {
  yBot: number; h: number; color: string; rOff?: number;
}) {
  return (
    <mesh castShadow receiveShadow position={[0, yBot + h / 2, 0]}>
      <cylinderGeometry
        args={[R + rOff, R + rOff, h, 256, 1, true, WALL_THETA_START, WALL_ARC_LEN]}
      />
      <meshStandardMaterial color={color} roughness={0.84} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Thin torus ring for horizontal mortar bed between courses */
function MortarBand({ y, color = '#cdd4e0', tube = 0.055 }: {
  y: number; color?: string; tube?: number;
}) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[R, tube, 6, 192]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

/** Battlement merlons placed at angular intervals, skipping the gate zone */
function WallMerlons({
  wallTopY, n = 64, mW = 0.9, mH = 0.62, mD = 0.72, color = NAMAA.stoneDark,
}: {
  wallTopY: number; n?: number; mW?: number; mH?: number; mD?: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        if (i % 2 !== 0) return null; // alternate gap / merlon
        const angle = (i / n) * Math.PI * 2;
        const norm  = Math.atan2(Math.sin(angle), Math.cos(angle));
        if (Math.abs(norm) < GATE_HALF_ANGLE * 1.4) return null; // skip gate zone
        return (
          <mesh key={i} castShadow
                position={[Math.cos(angle) * R, wallTopY + mH / 2, Math.sin(angle) * R]}
                rotation={[0, -angle, 0]}>
            <boxGeometry args={[mW, mH, mD]} />
            <meshStandardMaterial color={color} roughness={0.88} />
          </mesh>
        );
      })}
    </>
  );
}

// /** useCourse kept only for tower-position helpers in tier 2 & 3 */
// function useCourse(N: number, angleOffset = 0) {
//   return useMemo(() => {
//     const step = (Math.PI * 2) / N;
//     const chord = 2 * R * Math.sin(Math.PI / N);
//     const segW = chord * 1.12;
//     return Array.from({ length: N }, (_, i) => {
//       const angle = i * step + angleOffset;
//       const norm = Math.atan2(Math.sin(angle), Math.cos(angle));
//       const skip = Math.abs(norm) < GATE_HALF_ANGLE;
//       return { x: Math.cos(angle) * R, z: Math.sin(angle) * R, rotY: -angle, segW, skip };
//     }).filter(s => !s.skip);
//   }, [N, angleOffset]);
// }

/* ═══════════════════════════════════════════════════
   GATES — one per tier, placed at (R, 0, 0), rotY=0
   Local space: X=radial-out, Z=tangential, Y=up
   ═══════════════════════════════════════════════════ */

/** Tier 1: Simple wooden gate — two posts + crossbeam + two-leaf plank door */
function WoodenGate() {
  const postH  = 3.4;
  const postR  = 0.22;
  const spanZ  = 1.9;   // half-span from centre
  const doorH  = postH * 0.82;
  const leafW  = spanZ - 0.08; // each leaf's Z half-width

  return (
    <group position={[R, 0, 0]}>
      {/* Left & right wooden posts */}
      {[-spanZ, spanZ].map((z, i) => (
        <group key={i} position={[0, postH / 2, z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[postR, postR * 1.1, postH, 8]} />
            <meshStandardMaterial color={NAMAA.woodDark} roughness={0.95} />
          </mesh>
          <mesh castShadow position={[0, postH / 2 + 0.3, 0]}>
            <coneGeometry args={[postR, 0.6, 6]} />
            <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Top crossbeam */}
      <mesh castShadow position={[0, postH - 0.1, 0]}>
        <boxGeometry args={[0.4, 0.28, spanZ * 2 + 0.5]} />
        <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
      </mesh>

      {/* Mid crossbeam */}
      <mesh castShadow position={[0, postH * 0.55, 0]}>
        <boxGeometry args={[0.35, 0.22, spanZ * 2 + 0.3]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.95} />
      </mesh>

      {/* ── Two-leaf wooden plank door ── */}
      {([-1, 1] as const).map(side => {
        const zC = side * leafW / 2;
        return (
          <group key={side} position={[-0.08, doorH / 2, zC]}>
            {/* Door panel — vertical planks as one slab */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.22, doorH, leafW]} />
              <meshStandardMaterial color={NAMAA.wood} roughness={0.91} />
            </mesh>
            {/* Raised horizontal rails (3×) */}
            {[-doorH * 0.34, 0, doorH * 0.34].map((dy, j) => (
              <mesh key={j} castShadow position={[0.06, dy, 0]}>
                <boxGeometry args={[0.06, 0.16, leafW * 0.9]} />
                <meshStandardMaterial color={NAMAA.woodDark} roughness={0.93} />
              </mesh>
            ))}
            {/* Diagonal brace per leaf */}
            <mesh castShadow position={[0.07, 0, 0]}
                  rotation={[Math.atan2(doorH * 0.65, leafW * 0.7 * side), 0, 0]}>
              <boxGeometry args={[0.05, Math.hypot(doorH * 0.65, leafW * 0.7), 0.08]} />
              <meshStandardMaterial color={NAMAA.woodDark} roughness={0.94} />
            </mesh>
            {/* Hinges (on outer edge) */}
            {[-doorH * 0.3, doorH * 0.3].map((dy, j) => (
              <mesh key={j} castShadow
                    position={[0.12, dy, side * (leafW / 2 - 0.08)]}
                    rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.28, 8]} />
                <meshStandardMaterial color="#5a4a30" metalness={0.3} roughness={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/** Tier 2: Stone archway gate with pilasters, round arch and a guard room above */
function StoneGate() {
  const pillarH  = 5.0;
  const pillarW  = 1.1;
  const pillarD  = 0.85;
  const spanZ    = 2.0;        // half gate span
  const archR    = spanZ;      // arch inner radius = half span
  const archTube = 0.32;
  const doorTopY = pillarH - archR - archTube; // where arch base sits

  return (
    <group position={[R, 0, 0]}>
      {/* ── Pilasters (left & right) ── */}
      {[-spanZ - pillarW / 2, spanZ + pillarW / 2].map((z, i) => (
        <group key={i} position={[0, pillarH / 2, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[pillarD, pillarH, pillarW]} />
            <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.85} />
          </mesh>
          {/* Pilaster cap */}
          <mesh castShadow position={[0, pillarH / 2 + 0.15, 0]}>
            <boxGeometry args={[pillarD + 0.12, 0.3, pillarW + 0.12]} />
            <meshStandardMaterial color={NAMAA.stone} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ── Fill wall between pilasters above the arch ── */}
      <mesh castShadow receiveShadow position={[0, doorTopY + archR + archTube + (pillarH - doorTopY - archR - archTube) / 2 + 0.05, 0]}>
        <boxGeometry args={[pillarD, pillarH - doorTopY - archR - archTube, spanZ * 2 + archTube * 2]} />
        <meshStandardMaterial color={NAMAA.stone} roughness={0.87} />
      </mesh>

      {/* ── Rounded stone arch (half-torus) ── */}
      <mesh castShadow position={[0, doorTopY + archR, 0]} rotation={ARCH_ROT}>
        <torusGeometry args={[archR, archTube, 10, 40, Math.PI]} />
        <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.82} />
      </mesh>

      {/* ── Keystone at arch crown ── */}
      <mesh castShadow position={[0, doorTopY + archR * 2 + archTube * 0.5, 0]}>
        <boxGeometry args={[pillarD + 0.05, archTube * 2, archTube * 2.2]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ── Guard room above gate ── */}
      <group position={[0, pillarH + 0.15, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[pillarD + 0.2, 1.2, spanZ * 2 + pillarW * 2 + 0.2]} />
          <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.84} />
        </mesh>
        {/* Merlons on top of guard room */}
        {[-2, -1, 0, 1, 2].map((j) => (
          <mesh key={j} castShadow position={[0, 0.8, j * 1.0]}>
            <boxGeometry args={[pillarD + 0.25, 0.55, 0.52]} />
            <meshStandardMaterial color={NAMAA.stone} roughness={0.88} />
          </mesh>
        ))}
        {/* Arrow-slit windows */}
        {[-1.2, 1.2].map((z, i) => (
          <mesh key={i} position={[0, 0.0, z]}>
            <boxGeometry args={[pillarD + 0.3, 0.55, 0.18]} />
            <meshStandardMaterial color="#2a2e38" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* ── Two-leaf iron-banded wooden door ── */}
      {([-1, 1] as const).map(side => {
        const leafW = spanZ - 0.1;
        const zC    = side * leafW / 2;
        const dH    = doorTopY * 0.97;
        return (
          <group key={side} position={[-0.1, dH / 2, zC]}>
            {/* Door body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.28, dH, leafW]} />
              <meshStandardMaterial color="#3d2b1a" roughness={0.88} />
            </mesh>
            {/* Vertical plank seams */}
            {[-leafW * 0.25, leafW * 0.25].map((dz, j) => (
              <mesh key={j} position={[0.08, 0, dz]}>
                <boxGeometry args={[0.04, dH * 0.98, 0.06]} />
                <meshStandardMaterial color="#2a1c0e" roughness={0.95} />
              </mesh>
            ))}
            {/* Iron bands (horizontal) */}
            {[-dH * 0.38, 0, dH * 0.38].map((dy, j) => (
              <mesh key={j} castShadow position={[0.12, dy, 0]}>
                <boxGeometry args={[0.08, 0.14, leafW + 0.06]} />
                <meshStandardMaterial color="#2e3240" metalness={0.6} roughness={0.5} />
              </mesh>
            ))}
            {/* Iron rivets on bands */}
            {[-dH * 0.38, 0, dH * 0.38].map((dy, j) =>
              [-leafW * 0.3, 0, leafW * 0.3].map((dz, k) => (
                <mesh key={`${j}-${k}`} position={[0.16, dy, dz]}>
                  <sphereGeometry args={[0.055, 6, 6]} />
                  <meshStandardMaterial color="#3a4055" metalness={0.7} roughness={0.4} />
                </mesh>
              ))
            )}
            {/* Heavy hinges on outer edge */}
            {[-dH * 0.32, dH * 0.32].map((dy, j) => (
              <mesh key={j} castShadow
                    position={[0.16, dy, side * (leafW / 2 - 0.1)]}
                    rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.38, 8]} />
                <meshStandardMaterial color="#252a38" metalness={0.65} roughness={0.45} />
              </mesh>
            ))}
            {/* Door ring handle */}
            {side === 1 && (
              <mesh castShadow position={[0.2, 0, -leafW * 0.15]}
                    rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.13, 0.04, 8, 16]} />
                <meshStandardMaterial color="#8a7a50" metalness={0.6} roughness={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

/** Tier 3: Grand fortress gate — twin flanking towers, pointed grand arch, portcullis, gold trim */
function FortressGate() {
  const towerH   = 9.5;
  const towerR   = 1.55;
  const spanZ    = 2.2;          // half opening span
  const archR    = spanZ;
  const archTube = 0.42;
  const doorTopY = 3.2;          // arch spring height
  const archTopY = doorTopY + archR;

  return (
    <group position={[R, 0, 0]}>
      {/* ── Twin flanking towers ── */}
      {[-spanZ - towerR * 0.8, spanZ + towerR * 0.8].map((z, i) => (
        <group key={i} position={[0, towerH / 2, z]}>
          {/* Tower body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[towerR, towerR * 1.15, towerH, 14]} />
            <meshStandardMaterial color={NAMAA.white} roughness={0.72} />
          </mesh>
          {/* Stone ring bands */}
          {[2.0, 4.0, 6.0].map((dy, j) => (
            <mesh key={j} position={[0, dy - towerH / 2, 0]}>
              <cylinderGeometry args={[towerR + 0.08, towerR + 0.08, 0.16, 14]} />
              <meshStandardMaterial color={NAMAA.stone} roughness={0.8} />
            </mesh>
          ))}
          {/* Gold crown band */}
          <mesh position={[0, towerH / 2 - 0.2, 0]}>
            <cylinderGeometry args={[towerR + 0.1, towerR + 0.1, 0.26, 14]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.75} roughness={0.2} />
          </mesh>
          {/* Crenellated top */}
          {Array.from({ length: 8 }, (_, j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <mesh key={j} castShadow position={[Math.cos(a) * (towerR - 0.1), towerH / 2 + 0.4, Math.sin(a) * (towerR - 0.1)]}>
                <boxGeometry args={[0.44, 0.76, 0.44]} />
                <meshStandardMaterial color={NAMAA.white} roughness={0.75} />
              </mesh>
            );
          })}
          {/* Dome */}
          <mesh castShadow position={[0, towerH / 2 + 0.9, 0]}>
            <sphereGeometry args={[towerR * 0.95, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.82} roughness={0.16} />
          </mesh>
          {/* Spire */}
          <mesh position={[0, towerH / 2 + towerR * 0.95 + 0.9, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 1.7, 6]} />
            <meshStandardMaterial color={NAMAA.goldLight} emissive={NAMAA.gold} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, towerH / 2 + towerR * 0.95 + 1.8, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ── Connecting wall mass above arch between towers ── */}
      <mesh castShadow receiveShadow position={[0, (archTopY + towerH) / 2, 0]}>
        <boxGeometry args={[1.05, towerH - archTopY, spanZ * 2 + towerR * 1.6 * 2]} />
        <meshStandardMaterial color={NAMAA.white} roughness={0.74} />
      </mesh>

      {/* ── Grand pointed stone arch ── */}
      {/* Use two offset torus halves for a pointed/ogival look */}
      {[-0.5, 0.5].map((offset, i) => (
        <mesh key={i} castShadow
              position={[0, doorTopY + archR * 0.9, offset]}
              rotation={ARCH_ROT}>
          <torusGeometry args={[archR * 1.05, archTube, 12, 48, Math.PI * 0.72]} />
          <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.78} />
        </mesh>
      ))}

      {/* ── Gold trim arch band ── */}
      <mesh castShadow position={[0, doorTopY + archR, 0]} rotation={ARCH_ROT}>
        <torusGeometry args={[archR - archTube * 0.1, 0.10, 8, 48, Math.PI]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* ── Keystone (gold) ── */}
      <mesh castShadow position={[0, doorTopY + archR * 2 + 0.2, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.75]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.65} roughness={0.3} />
      </mesh>

      {/* ── Two-leaf heavy fortress door ── */}
      {([-1, 1] as const).map(side => {
        const leafW = spanZ - 0.12;
        const zC    = side * leafW / 2;
        const dH    = doorTopY * 0.98;
        return (
          <group key={side} position={[-0.12, dH / 2, zC]}>
            {/* Door body — dark iron-wood */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.34, dH, leafW]} />
              <meshStandardMaterial color="#1e1a14" roughness={0.85} />
            </mesh>
            {/* Vertical plank seams */}
            {([-leafW * 0.28, 0, leafW * 0.28] as const).map((dz, j) => (
              <mesh key={j} position={[0.1, 0, dz]}>
                <boxGeometry args={[0.04, dH * 0.97, 0.07]} />
                <meshStandardMaterial color="#111009" roughness={0.96} />
              </mesh>
            ))}
            {/* Heavy iron bands */}
            {([-dH * 0.38, -dH * 0.12, dH * 0.12, dH * 0.38] as const).map((dy, j) => (
              <mesh key={j} castShadow position={[0.15, dy, 0]}>
                <boxGeometry args={[0.1, 0.18, leafW + 0.08]} />
                <meshStandardMaterial color="#252932" metalness={0.75} roughness={0.4} />
              </mesh>
            ))}
            {/* Iron rivets on each band */}
            {([-dH * 0.38, -dH * 0.12, dH * 0.12, dH * 0.38] as const).map((dy, j) =>
              ([-leafW * 0.35, -leafW * 0.1, leafW * 0.1, leafW * 0.35] as const).map((dz, k) => (
                <mesh key={`${j}-${k}`} position={[0.21, dy, dz]}>
                  <sphereGeometry args={[0.065, 6, 6]} />
                  <meshStandardMaterial color="#3a4055" metalness={0.8} roughness={0.35} />
                </mesh>
              ))
            )}
            {/* Gold ornament strip down centre */}
            <mesh castShadow position={[0.18, 0, 0]}>
              <boxGeometry args={[0.06, dH * 0.7, 0.1]} />
              <meshStandardMaterial color={NAMAA.gold} metalness={0.75} roughness={0.3} />
            </mesh>
            {/* Heavy hinges (outer edge) */}
            {([-dH * 0.35, 0, dH * 0.35] as const).map((dy, j) => (
              <mesh key={j} castShadow
                    position={[0.22, dy, side * (leafW / 2 - 0.1)]}
                    rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.45, 10]} />
                <meshStandardMaterial color="#1e2230" metalness={0.7} roughness={0.4} />
              </mesh>
            ))}
            {/* Door ring (inner edge) */}
            {side === -1 && (
              <mesh castShadow position={[0.24, 0, leafW * 0.18]}
                    rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.16, 0.055, 8, 16]} />
                <meshStandardMaterial color={NAMAA.gold} metalness={0.7} roughness={0.35} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ── Portcullis visible behind door (raised slot) ── */}
      {[-1.1, 0, 1.1].map((z, i) => (
        <mesh key={i} position={[0.2, doorTopY * 0.5, z]}>
          <boxGeometry args={[0.12, doorTopY, 0.12]} />
          <meshStandardMaterial color="#2a2f3a" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {[0.9, 1.9, 2.8].map((y, i) => (
        <mesh key={i} position={[0.2, y, 0]}>
          <boxGeometry args={[0.12, 0.12, spanZ * 2]} />
          <meshStandardMaterial color="#2a2f3a" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}

      {/* ── Gold trim band across connecting wall ── */}
      <mesh position={[0, towerH * 0.62, 0]}>
        <boxGeometry args={[1.08, 0.22, spanZ * 2 + towerR * 1.6 * 2 + 0.1]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.68} roughness={0.25} />
      </mesh>

      {/* ── Arrow slits on connecting wall ── */}
      {[-1.3, 0, 1.3].map((z, i) => (
        <mesh key={i} position={[0, towerH * 0.48, z]}>
          <boxGeometry args={[1.1, 0.6, 0.2]} />
          <meshStandardMaterial color="#1e2230" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   TIER 1 — Dense wooden palisade
   ═══════════════════════════════════════════════════ */
function WoodenPalisade() {
  const N = 64;
  const step = (Math.PI * 2) / N;
  const chord = 2 * R * Math.sin(Math.PI / N);
  const bW = chord * 1.04;

  const boards = useMemo(() =>
    Array.from({ length: N }, (_, i) => {
      const angle = i * step;
      const norm = Math.atan2(Math.sin(angle), Math.cos(angle));
      if (Math.abs(norm) < GATE_HALF_ANGLE) return null; // gate gap
      const tall = i % 2 === 0;
      return {
        x: Math.cos(angle) * R,
        z: Math.sin(angle) * R,
        rotY: -angle,
        h: tall ? 2.6 : 2.2,
        tipH: tall ? 0.55 : 0.4,
      };
    }).filter(Boolean) as { x:number; z:number; rotY:number; h:number; tipH:number }[],
  []);

  return (
    <group>
      {boards.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]} rotation={[0, b.rotY, 0]}>
          <mesh castShadow receiveShadow position={[0, b.h / 2, 0]}>
            <boxGeometry args={[bW, b.h, 0.4]} />
            <meshStandardMaterial color={NAMAA.woodDark} roughness={0.96} />
          </mesh>
          <mesh castShadow position={[0, b.h + b.tipH / 2, 0]}>
            <coneGeometry args={[bW / 2, b.tipH, 4]} />
            <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {[0.8, 1.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[R, 0.07, 6, 128]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
        </mesh>
      ))}
      <WoodenGate />
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   TIER 2 — Two-course interlocking stone wall
   ═══════════════════════════════════════════════════ */
function StoneWall() {
  const courseH  = 1.1;
  const mortarH  = 0.09;
  const nCourses = 3;
  const wallTopY = nCourses * (courseH + mortarH);
  // colours alternate light/dark per course
  const courseColors = ['#8a93a8', '#9ba5bc', '#7e8898'];

  const towers = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      return { x: Math.cos(angle) * R, z: Math.sin(angle) * R };
    }),
  []);

  return (
    <group>
      {/* ── Seamless stone wall body (one arc cylinder per course, NO joints) ── */}
      {Array.from({ length: nCourses }, (_, row) => (
        <WallArc
          key={row}
          yBot={row * (courseH + mortarH)}
          h={courseH}
          color={courseColors[row % courseColors.length]}
        />
      ))}

      {/* ── Horizontal mortar bed rings ── */}
      {Array.from({ length: nCourses - 1 }, (_, i) => (
        <MortarBand key={i} y={(i + 1) * (courseH + mortarH) - mortarH / 2} />
      ))}

      {/* ── Merlons ── */}
      <WallMerlons wallTopY={wallTopY} n={64} mW={0.88} mH={0.60} mD={0.70} />

      {towers.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh castShadow receiveShadow position={[0, 2.1, 0]}>
            <cylinderGeometry args={[1.15, 1.35, 4.2, 12]} />
            <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.82} />
          </mesh>
          {[0,1,2,3,4,5].map(j => {
            const a = (j/6)*Math.PI*2;
            return (
              <mesh key={j} castShadow position={[Math.cos(a)*1.05, 4.55, Math.sin(a)*1.05]}>
                <boxGeometry args={[0.42, 0.6, 0.42]} />
                <meshStandardMaterial color={NAMAA.stone} roughness={0.88} />
              </mesh>
            );
          })}
          <mesh castShadow position={[0, 5.1, 0]}>
            <coneGeometry args={[1.25, 1.5, 12]} />
            <meshStandardMaterial color={NAMAA.purpleDeep} roughness={0.7} />
          </mesh>
          <mesh position={[0, 6.25, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.9, 6]} />
            <meshStandardMaterial color={NAMAA.gold} />
          </mesh>
        </group>
      ))}

      <StoneGate />
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   TIER 3 — Three-course fortress wall (English bond)
   ═══════════════════════════════════════════════════ */
function GrandFortress() {
  const courseH  = 1.1;
  const mortarH  = 0.09;
  const nCourses = 5;
  const wallTopY = nCourses * (courseH + mortarH);
  const courseColors = ['#6b7587', '#5e6878', '#737d91', '#636e82', '#6a7384'];

  const towers = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      return { x: Math.cos(angle) * R, z: Math.sin(angle) * R };
    }),
  []);

  return (
    <group>
      {/* ── Seamless stone wall body (one solid arc per course) ── */}
      {Array.from({ length: nCourses }, (_, row) => (
        <WallArc
          key={row}
          yBot={row * (courseH + mortarH)}
          h={courseH}
          color={courseColors[row % courseColors.length]}
        />
      ))}

      {/* ── Horizontal mortar bed rings ── */}
      {Array.from({ length: nCourses - 1 }, (_, i) => (
        <MortarBand key={i} y={(i + 1) * (courseH + mortarH) - mortarH / 2} color="#b8c2d4" />
      ))}

      {/* ── Gold accent band at wall top ── */}
      <mesh position={[0, wallTopY + 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R, 0.12, 8, 192]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.68} roughness={0.24} />
      </mesh>

      {/* ── Merlons ── */}
      <WallMerlons
        wallTopY={wallTopY} n={72}
        mW={1.0} mH={0.82} mD={0.85}
        color={NAMAA.stoneDark}
      />

      {towers.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
            <cylinderGeometry args={[1.4, 1.65, 6.4, 14]} />
            <meshStandardMaterial color={NAMAA.white} roughness={0.72} />
          </mesh>
          {[1.5, 3.0, 4.5].map((y, j) => (
            <mesh key={j} position={[0, y, 0]}>
              <cylinderGeometry args={[1.68, 1.68, 0.14, 14]} />
              <meshStandardMaterial color={NAMAA.stone} roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 6.55, 0]}>
            <cylinderGeometry args={[1.45, 1.45, 0.24, 14]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.72} roughness={0.2} />
          </mesh>
          {Array.from({length: 8}, (_, j) => {
            const a = (j/8)*Math.PI*2;
            return (
              <mesh key={j} castShadow position={[Math.cos(a)*1.3, 7.15, Math.sin(a)*1.3]}>
                <boxGeometry args={[0.46, 0.78, 0.46]} />
                <meshStandardMaterial color={NAMAA.white} roughness={0.75} />
              </mesh>
            );
          })}
          <mesh castShadow position={[0, 7.7, 0]}>
            <sphereGeometry args={[1.38, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.8} roughness={0.18} />
          </mesh>
          <mesh position={[0, 8.85, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 1.6, 6]} />
            <meshStandardMaterial color={NAMAA.goldLight} emissive={NAMAA.gold} emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0, 9.7, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.85} />
          </mesh>
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <ringGeometry args={[R + 1.0, R + 2.5, 128]} />
        <meshStandardMaterial color="#233a2a" roughness={1} transparent opacity={0.55} />
      </mesh>

      <FortressGate />
    </group>
  );
}

/* ── Main export ── */
export function Wall({ tier }: { tier: Tier }) {
  return (
    <group>
      <TierGroup active={tier === 1}><WoodenPalisade /></TierGroup>
      <TierGroup active={tier === 2}><StoneWall /></TierGroup>
      <TierGroup active={tier === 3}><GrandFortress /></TierGroup>
    </group>
  );
}
