import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

/* ─── palette ─── */
const MARBLE  = '#f0ece0';      // marble / white stone
const MARBLE2 = '#d8d0bc';      // darker marble
const GRANITE = '#8a93a8';      // grey stone walls
const GRANITE2 = '#5b6478';     // dark granite
const GOLD    = NAMAA.gold;
const STEP    = '#c8c0aa';      // step stone

/* ─── shared helpers ─── */

/** Raised platform / steps */
function Steps({ w, d, levels = 2, color = STEP }: {
  w: number; d: number; levels?: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: levels }, (_, i) => (
        <mesh key={i} receiveShadow castShadow
              position={[0, i * 0.14 + 0.07, (levels - 1 - i) * 0.18]}>
          <boxGeometry args={[w + i * 0.26, 0.14, d + i * 0.36]} />
          <meshStandardMaterial color={color} roughness={0.88} />
        </mesh>
      ))}
    </>
  );
}

/** Classical column with base + capital */
function Column({ x, z, h, r = 0.18, color = MARBLE }: {
  x: number; z: number; h: number; r?: number; color?: string;
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Base */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[r * 1.28, r * 1.28, 0.2, 12]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.82} />
      </mesh>
      {/* Shaft */}
      <mesh castShadow position={[0, h / 2 + 0.2, 0]}>
        <cylinderGeometry args={[r, r * 1.08, h, 12]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      {/* Capital */}
      <mesh castShadow position={[0, h + 0.2, 0]}>
        <cylinderGeometry args={[r * 1.42, r, 0.28, 12]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Triangular pediment (Greek temple gable) */
function Pediment({ w, h, d = 0.28, color = MARBLE }: {
  w: number; h: number; d?: number; color?: string;
}) {
  // Two sloping panels meeting at a ridge
  return (
    <group>
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow
              position={[0, h * 0.3, s * d * 0.24]}
              rotation={[s * -0.54, 0, 0]}>
          <boxGeometry args={[w, 0.12, d * 0.58]} />
          <meshStandardMaterial color={color} roughness={0.78} />
        </mesh>
      ))}
      {/* Entablature base beam */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[w, 0.18, d + 0.06]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Arched window */
function ArchWindow({ x, y, z, w = 0.5, h = 0.7 }: {
  x: number; y: number; z: number; w?: number; h?: number;
}) {
  return (
    <group position={[x, y, z]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.1]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.8} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#aad4f5" transparent opacity={0.65} roughness={0.1} />
      </mesh>
      {/* Arch keystone */}
      <mesh position={[0, h * 0.5 + 0.04, 0.04]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <torusGeometry args={[w * 0.5, 0.055, 7, 14, Math.PI]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.82} />
      </mesh>
    </group>
  );
}

/** Vault / safe door — the child's treasure */
function VaultDoor({ x, y, z, r = 0.52, sc = 1 }: {
  x: number; y: number; z: number; r?: number; sc?: number;
}) {
  return (
    <group position={[x, y, z]} scale={sc}>
      {/* Circular vault body */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.22, 16]} />
        <meshStandardMaterial color={GRANITE2} metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Outer ring */}
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r + 0.06, r + 0.06, 0.1, 16]} />
        <meshStandardMaterial color={NAMAA.goldDark} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Inner panel */}
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.72, r * 0.72, 0.08, 12]} />
        <meshStandardMaterial color={GRANITE} metalness={0.45} roughness={0.55} />
      </mesh>
      {/* Handle wheel spokes */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[0, 0, 0.13]}
              rotation={[0, 0, (i * Math.PI) / 2]}>
          <boxGeometry args={[r * 1.28, 0.07, 0.06]} />
          <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
      {/* Centre hub */}
      <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 1 — بيت الادخار
   مبنى حجري صغير بباب وشبابيك وخزنة صغيرة
   ════════════════════════════════════════════ */
function SavingsHouse() {
  const bW = 2.4, bD = 1.8, bH = 2.0;

  return (
    <group>
      {/* Steps */}
      <group position={[0, 0, bD / 2]}>
        <Steps w={bW + 0.3} d={0.7} levels={2} />
      </group>

      {/* Main building walls */}
      <mesh castShadow receiveShadow position={[0, bH / 2 + 0.28, 0]}>
        <boxGeometry args={[bW, bH, bD]} />
        <meshStandardMaterial color={GRANITE} roughness={0.86} />
      </mesh>

      {/* Cornice */}
      <mesh castShadow position={[0, bH + 0.34, 0]}>
        <boxGeometry args={[bW + 0.18, 0.22, bD + 0.18]} />
        <meshStandardMaterial color={GRANITE2} roughness={0.84} />
      </mesh>

      {/* Simple gabled roof */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow
              position={[0, bH + 0.72, s * bD * 0.24]}
              rotation={[s * -0.52, 0, 0]}>
          <boxGeometry args={[bW + 0.18, 0.14, bD * 0.58]} />
          <meshStandardMaterial color={MARBLE2} roughness={0.82} />
        </mesh>
      ))}
      <mesh castShadow position={[0, bH + 1.0, 0]}>
        <boxGeometry args={[bW + 0.18, 0.14, bD * 0.14]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.82} />
      </mesh>

      {/* Front door */}
      <group position={[0, bH * 0.34 + 0.28, bD / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.58, bH * 0.68, 0.1]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.48, bH * 0.62, 0.07]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.82} />
        </mesh>
        {/* Door knob */}
        <mesh position={[0.2, 0, 0.1]}>
          <sphereGeometry args={[0.06, 7, 7]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Windows */}
      <ArchWindow x={-0.78} y={bH * 0.6 + 0.28} z={bD / 2 + 0.06} w={0.46} h={0.6} />
      <ArchWindow x={ 0.78} y={bH * 0.6 + 0.28} z={bD / 2 + 0.06} w={0.46} h={0.6} />

      {/* Small vault door on front below window */}
      <VaultDoor x={0} y={bH * 0.22 + 0.28} z={bD / 2 + 0.14} r={0.32} sc={0.85} />

      {/* Sign board */}
      <mesh castShadow position={[0, bH + 0.24, bD / 2 + 0.16]}>
        <boxGeometry args={[1.1, 0.28, 0.08]} />
        <meshStandardMaterial color={NAMAA.goldDark} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Coin slot on roof ridge (piggy bank touch) */}
      <mesh position={[0, bH + 1.06, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.65} roughness={0.35} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 2 — بنك الحي
   بناء كلاسيكي بأعمدة + درج + حارس + خزنة
   ════════════════════════════════════════════ */
function CommunityBank() {
  const bW = 3.4, bD = 2.2, bH = 2.8;
  const colH = bH * 1.02;

  return (
    <group>
      {/* Wide steps */}
      <group position={[0, 0, bD / 2 + 0.1]}>
        <Steps w={bW + 0.5} d={0.9} levels={3} />
      </group>

      {/* Main building */}
      <mesh castShadow receiveShadow position={[0, bH / 2 + 0.42, 0]}>
        <boxGeometry args={[bW, bH, bD]} />
        <meshStandardMaterial color={GRANITE} roughness={0.83} />
      </mesh>

      {/* Frieze band */}
      <mesh castShadow position={[0, bH + 0.52, 0]}>
        <boxGeometry args={[bW + 0.28, 0.32, bD + 0.28]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.8} />
      </mesh>

      {/* 4 front columns */}
      {([-1.1, -0.37, 0.37, 1.1] as const).map((x, i) => (
        <Column key={i} x={x} z={bD / 2 + 0.22} h={colH} r={0.19} />
      ))}

      {/* Pediment */}
      <group position={[0, bH + 0.84, bD / 2 + 0.22]}>
        <Pediment w={bW + 0.3} h={0.85} d={0.34} />
      </group>

      {/* Arched windows */}
      <ArchWindow x={-1.1} y={bH * 0.58 + 0.42} z={bD / 2 + 0.06} w={0.54} h={0.75} />
      <ArchWindow x={ 1.1} y={bH * 0.58 + 0.42} z={bD / 2 + 0.06} w={0.54} h={0.75} />
      {/* Side windows */}
      <ArchWindow x={bW / 2 + 0.05} y={bH * 0.55 + 0.42} z={0} w={0.52} h={0.7} />

      {/* Front entrance door */}
      <group position={[0, bH * 0.38 + 0.42, bD / 2 + 0.02]}>
        {/* Door surround */}
        <mesh castShadow>
          <boxGeometry args={[0.82, bH * 0.76, 0.12]} />
          <meshStandardMaterial color={MARBLE2} roughness={0.8} />
        </mesh>
        {/* Double door panels */}
        {([-1, 1] as const).map((s, i) => (
          <mesh key={i} castShadow position={[s * 0.19, 0, 0.08]}>
            <boxGeometry args={[0.36, bH * 0.72, 0.08]} />
            <meshStandardMaterial color={NAMAA.woodDark} roughness={0.84} />
          </mesh>
        ))}
        {/* Door handles */}
        {([-1, 1] as const).map((s, i) => (
          <mesh key={i} position={[s * 0.06, 0, 0.14]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.28} />
          </mesh>
        ))}
        {/* Arch over door */}
        <mesh position={[0, bH * 0.38, 0.1]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.41, 0.065, 8, 18, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* Vault door (prominent, on front below windows) */}
      <VaultDoor x={0} y={bH * 0.2 + 0.42} z={bD / 2 + 0.14} r={0.46} />

      {/* Sign above door */}
      <mesh castShadow position={[0, bH + 0.4, bD / 2 + 0.2]}>
        <boxGeometry args={[1.6, 0.3, 0.09]} />
        <meshStandardMaterial color={NAMAA.goldDark} metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, bH + 0.4, bD / 2 + 0.26]}>
        <boxGeometry args={[1.58, 0.1, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.65} roughness={0.32} />
      </mesh>

      {/* Side pilasters */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow position={[s * (bW / 2 + 0.06), bH / 2 + 0.42, 0]}>
          <boxGeometry args={[0.14, bH, bD + 0.08]} />
          <meshStandardMaterial color={MARBLE2} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 3 — البنك الكبير
   قصر مالي: 6 أعمدة + قبة ذهبية + خزنة كبيرة + عملات تحوم
   ════════════════════════════════════════════ */
function GrandBank() {
  const bW = 4.4, bD = 2.8, bH = 3.6;
  const colH = bH * 1.04;

  return (
    <group>
      {/* Grand marble steps */}
      <group position={[0, 0, bD / 2 + 0.2]}>
        <Steps w={bW + 0.7} d={1.1} levels={4} color={MARBLE} />
      </group>

      {/* Main building body */}
      <mesh castShadow receiveShadow position={[0, bH / 2 + 0.56, 0]}>
        <boxGeometry args={[bW, bH, bD]} />
        <meshStandardMaterial color={MARBLE} roughness={0.78} />
      </mesh>

      {/* Side rusticated base */}
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[bW + 0.06, 0.84, bD + 0.06]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.85} />
      </mesh>

      {/* Entablature */}
      <mesh castShadow position={[0, bH + 0.66, 0]}>
        <boxGeometry args={[bW + 0.36, 0.38, bD + 0.36]} />
        <meshStandardMaterial color={MARBLE2} roughness={0.76} />
      </mesh>
      {/* Gold frieze trim */}
      <mesh castShadow position={[0, bH + 0.72, 0]}>
        <boxGeometry args={[bW + 0.38, 0.1, bD + 0.38]} />
        <meshStandardMaterial color={GOLD} metalness={0.65} roughness={0.32} />
      </mesh>

      {/* 6 front columns */}
      {([-1.65, -0.99, -0.33, 0.33, 0.99, 1.65] as const).map((x, i) => (
        <Column key={i} x={x} z={bD / 2 + 0.28} h={colH} r={0.21} color={MARBLE} />
      ))}

      {/* Grand pediment */}
      <group position={[0, bH + 1.04, bD / 2 + 0.28]}>
        <Pediment w={bW + 0.38} h={1.05} d={0.38} color={MARBLE} />
        {/* Gold pediment trim */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[bW + 0.36, 0.07, 0.42]} />
          <meshStandardMaterial color={GOLD} metalness={0.65} roughness={0.32} />
        </mesh>
      </group>

      {/* Dome drum */}
      <mesh castShadow position={[0, bH + 0.78, 0]}>
        <cylinderGeometry args={[0.92, 1.0, 1.0, 14]} />
        <meshStandardMaterial color={MARBLE} roughness={0.75} />
      </mesh>
      {/* Dome */}
      <mesh castShadow position={[0, bH + 1.38, 0]}>
        <sphereGeometry args={[1.0, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={GOLD} metalness={0.72} roughness={0.24} />
      </mesh>
      {/* Dome spire */}
      <mesh position={[0, bH + 2.38, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.7, 7]} />
        <meshStandardMaterial color={GOLD} metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, bH + 2.76, 0]}>
        <sphereGeometry args={[0.13, 9, 9]} />
        <meshStandardMaterial color={NAMAA.goldLight} metalness={0.9} roughness={0.14} />
      </mesh>

      {/* Arched windows (front) */}
      <ArchWindow x={-1.55} y={bH * 0.55 + 0.56} z={bD / 2 + 0.06} w={0.6} h={0.85} />
      <ArchWindow x={ 1.55} y={bH * 0.55 + 0.56} z={bD / 2 + 0.06} w={0.6} h={0.85} />
      {/* Side windows */}
      <ArchWindow x={bW / 2 + 0.05} y={bH * 0.5 + 0.56} z={ 0.6} w={0.58} h={0.8} />
      <ArchWindow x={bW / 2 + 0.05} y={bH * 0.5 + 0.56} z={-0.6} w={0.58} h={0.8} />

      {/* Grand double door */}
      <group position={[0, bH * 0.38 + 0.56, bD / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, bH * 0.76, 0.14]} />
          <meshStandardMaterial color={MARBLE2} roughness={0.78} />
        </mesh>
        {([-1, 1] as const).map((s, i) => (
          <mesh key={i} castShadow position={[s * 0.25, 0, 0.09]}>
            <boxGeometry args={[0.46, bH * 0.72, 0.09]} />
            <meshStandardMaterial color={NAMAA.woodDark} roughness={0.82} />
          </mesh>
        ))}
        {([-1, 1] as const).map((s, i) => (
          <mesh key={i} position={[s * 0.08, 0, 0.16]}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.78} roughness={0.25} />
          </mesh>
        ))}
        {/* Gold arch */}
        <mesh position={[0, bH * 0.39, 0.12]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.56, 0.075, 8, 20, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Grand vault door — الخزنة الكبيرة */}
      <VaultDoor x={0} y={bH * 0.18 + 0.56} z={bD / 2 + 0.16} r={0.62} />

      {/* Vault label */}
      <mesh castShadow position={[0, bH + 0.56, bD / 2 + 0.22]}>
        <boxGeometry args={[2.0, 0.34, 0.1]} />
        <meshStandardMaterial color={NAMAA.goldDark} metalness={0.58} roughness={0.36} />
      </mesh>
      <mesh position={[0, bH + 0.56, bD / 2 + 0.28]}>
        <boxGeometry args={[1.98, 0.12, 0.05]} />
        <meshStandardMaterial color={NAMAA.goldLight} metalness={0.7} roughness={0.28} />
      </mesh>

      {/* Side pilasters */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow position={[s * (bW / 2 + 0.08), bH / 2 + 0.56, 0]}>
          <boxGeometry args={[0.18, bH, bD + 0.06]} />
          <meshStandardMaterial color={MARBLE2} roughness={0.8} />
        </mesh>
      ))}

      {/* Floating gold coins — symbol of savings */}
      {[0, 1, 2].map(i => (
        <Floating key={i} height={0.22} speed={1.6 + i * 0.5} yOffset={bH + 3.2 + i * 0.55}>
          <mesh rotation={[Math.PI / 2, 0, i * 1.1]}>
            <cylinderGeometry args={[0.22 - i * 0.04, 0.22 - i * 0.04, 0.06, 20]} />
            <meshStandardMaterial
              color={NAMAA.goldLight}
              metalness={0.92}
              roughness={0.12}
              emissive={GOLD}
              emissiveIntensity={0.45}
            />
          </mesh>
        </Floating>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════ */
export function Bank({ tier, level, position }: {
  tier: Tier;
  level: number;
  position: [number, number, number];
}) {
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

        <TierGroup active={tier === 1}><SavingsHouse /></TierGroup>
        <TierGroup active={tier === 2}><CommunityBank /></TierGroup>
        <TierGroup active={tier === 3}><GrandBank /></TierGroup>
      </group>
    </group>
  );
}
