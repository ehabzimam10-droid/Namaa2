import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

/* ─── palette ─── */
const WALL  = '#d9c69a';      // warm sandy stone
const WALL2 = '#c2a96a';      // darker stone trim
const ROOF  = NAMAA.amberDeep;
const AWN1  = NAMAA.amber;
const AWN2  = '#fff4de';      // cream stripe
const GOODS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];

/* ─── shared helpers ─── */

/** Striped awning canopy */
function Awning({ w, d, y, z, stripes = 6 }: {
  w: number; d: number; y: number; z: number; stripes?: number;
}) {
  const sw = w / stripes;
  return (
    <group position={[0, y, z]} rotation={[-0.3, 0, 0]}>
      {Array.from({ length: stripes }, (_, i) => (
        <mesh key={i} castShadow position={[(i - (stripes - 1) / 2) * sw, 0, 0]}>
          <boxGeometry args={[sw * 0.97, 0.07, d]} />
          <meshStandardMaterial color={i % 2 === 0 ? AWN1 : AWN2} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

/** Wooden support post */
function Post({ x, z, h = 1.9 }: { x: number; z: number; h?: number }) {
  return (
    <mesh castShadow position={[x, h / 2, z]}>
      <cylinderGeometry args={[0.075, 0.09, h, 7]} />
      <meshStandardMaterial color={NAMAA.woodDark} roughness={0.92} />
    </mesh>
  );
}

/** Coloured goods box */
function Box({ x, y, z, c, s = 0.28 }: { x: number; y: number; z: number; c: string; s?: number }) {
  return (
    <mesh castShadow position={[x, y, z]}>
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={c} roughness={0.75} />
    </mesh>
  );
}

/** Window with glass */
function Win({ x, y, z, w = 0.52, h = 0.58 }: { x: number; y: number; z: number; w?: number; h?: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.09]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#aad4f5" transparent opacity={0.65} roughness={0.1} />
      </mesh>
    </group>
  );
}

/** Simple hip-style roof (4 sloping panels + ridge) */
function HipRoof({ w, d, color }: { w: number; d: number; color: string }) {
  return (
    <group>
      {/* Front / back panels */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow
              position={[0, 0.28, s * d * 0.24]}
              rotation={[s * -0.54, 0, 0]}>
          <boxGeometry args={[w + 0.18, 0.1, d * 0.58]} />
          <meshStandardMaterial color={color} roughness={0.84} />
        </mesh>
      ))}
      {/* Side panels */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} castShadow
              position={[s * w * 0.24, 0.28, 0]}
              rotation={[0, 0, -s * 0.54]}>
          <boxGeometry args={[w * 0.58, 0.1, d + 0.14]} />
          <meshStandardMaterial color={color} roughness={0.84} />
        </mesh>
      ))}
      {/* Ridge */}
      <mesh castShadow position={[0, 0.58, 0]}>
        <boxGeometry args={[w * 0.44, 0.1, d * 0.44]} />
        <meshStandardMaterial color={NAMAA.copperDeep} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   TIER 1 — بسطة السوق
   كشك خشبي بعداد وأغطية مخططة وبضائع معروضة
   ════════════════════════════════════════════════════ */
function MarketStall() {
  return (
    <group>
      {/* Ground mat */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[2.6, 0.04, 2.1]} />
        <meshStandardMaterial color={NAMAA.sand} roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh castShadow receiveShadow position={[0, 0.95, -0.72]}>
        <boxGeometry args={[2.3, 1.9, 0.22]} />
        <meshStandardMaterial color={WALL} roughness={0.87} />
      </mesh>
      {/* Top trim */}
      <mesh castShadow position={[0, 1.92, -0.72]}>
        <boxGeometry args={[2.3, 0.16, 0.3]} />
        <meshStandardMaterial color={WALL2} roughness={0.84} />
      </mesh>

      {/* Counter body */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0.18]}>
        <boxGeometry args={[2.1, 0.5, 0.72]} />
        <meshStandardMaterial color={NAMAA.wood} roughness={0.87} />
      </mesh>
      {/* Counter top slab */}
      <mesh castShadow position={[0, 0.72, 0.18]}>
        <boxGeometry args={[2.2, 0.08, 0.78]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.82} />
      </mesh>

      {/* 4 corner posts + top beams */}
      {([-1.05, 1.05] as const).map((x, i) => (
        <Post key={`f${i}`} x={x} z={0.58} h={2.3} />
      ))}
      {([-1.05, 1.05] as const).map((x, i) => (
        <Post key={`b${i}`} x={x} z={-0.7} h={2.3} />
      ))}
      {/* Horizontal beams */}
      {([0.58, -0.7] as const).map((z, i) => (
        <mesh key={i} castShadow position={[0, 2.3, z]}>
          <boxGeometry args={[2.25, 0.11, 0.11]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
      ))}
      {/* Side beams */}
      {([-1.05, 1.05] as const).map((x, i) => (
        <mesh key={i} castShadow position={[x, 2.3, -0.06]}>
          <boxGeometry args={[0.11, 0.11, 1.36]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
      ))}

      {/* Awning */}
      <Awning w={2.2} d={1.1} y={2.24} z={-0.08} stripes={6} />

      {/* Goods on counter */}
      {GOODS.map((c, i) => (
        <Box key={i} x={(i - 2) * 0.39} y={0.86} z={0.15} c={c} />
      ))}

      {/* Back wall shelf + goods */}
      <mesh castShadow position={[0, 1.22, -0.6]}>
        <boxGeometry args={[2.0, 0.07, 0.28]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
      </mesh>
      {GOODS.slice(0, 4).map((c, i) => (
        <Box key={i} x={(i - 1.5) * 0.44} y={1.38} z={-0.6} c={c} />
      ))}

      {/* Sign board */}
      <mesh castShadow position={[0, 1.65, -0.61]}>
        <boxGeometry args={[1.2, 0.32, 0.09]} />
        <meshStandardMaterial color={NAMAA.amberDeep} roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.65, -0.56]}>
        <boxGeometry args={[1.18, 0.1, 0.05]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   TIER 2 — محل السوق
   متجر حقيقي بجدران وشبابيك وباب + بسطة جانبية
   ════════════════════════════════════════════════════ */
function MarketShop() {
  const bW = 2.8, bD = 2.1, bH = 2.3;

  return (
    <group>
      {/* Paved ground */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[4.4, 0.06, 3.8]} />
        <meshStandardMaterial color={NAMAA.sand} roughness={0.9} />
      </mesh>

      {/* ── Main shop body ── */}
      <group position={[-0.25, 0, -0.35]}>
        <mesh castShadow receiveShadow position={[0, bH / 2, 0]}>
          <boxGeometry args={[bW, bH, bD]} />
          <meshStandardMaterial color={WALL} roughness={0.84} />
        </mesh>
        {/* Cornice */}
        <mesh castShadow position={[0, bH + 0.14, 0]}>
          <boxGeometry args={[bW + 0.22, 0.28, bD + 0.22]} />
          <meshStandardMaterial color={WALL2} roughness={0.8} />
        </mesh>
        {/* Hip roof */}
        <group position={[0, bH + 0.28, 0]}>
          <HipRoof w={bW + 0.22} d={bD + 0.22} color={ROOF} />
        </group>

        {/* Door */}
        <mesh position={[0, 0.78, bD / 2 + 0.02]}>
          <boxGeometry args={[0.65, 1.56, 0.12]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.78, bD / 2 + 0.07]}>
          <boxGeometry args={[0.73, 1.64, 0.07]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.84} />
        </mesh>

        {/* Windows */}
        <Win x={-1.0} y={1.4} z={bD / 2 + 0.07} />
        <Win x={ 1.0} y={1.4} z={bD / 2 + 0.07} />

        {/* Front awning */}
        <Awning w={bW + 0.12} d={1.05} y={1.72} z={bD / 2 + 0.22} stripes={7} />
        <Post x={-1.35} z={bD / 2 + 0.74} h={1.62} />
        <Post x={ 1.35} z={bD / 2 + 0.74} h={1.62} />

        {/* Shop sign */}
        <mesh castShadow position={[0, bH + 0.0, bD / 2 + 0.16]}>
          <boxGeometry args={[1.5, 0.36, 0.1]} />
          <meshStandardMaterial color={NAMAA.amberDeep} roughness={0.7} />
        </mesh>
        <mesh position={[0, bH, bD / 2 + 0.22]}>
          <boxGeometry args={[1.48, 0.12, 0.05]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.55} roughness={0.38} />
        </mesh>
      </group>

      {/* ── Side stall ── */}
      <group position={[1.7, 0, 0.85]}>
        <mesh castShadow receiveShadow position={[0, 0.48, 0]}>
          <boxGeometry args={[1.35, 0.46, 0.68]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[1.42, 0.08, 0.74]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.82} />
        </mesh>
        <Post x={-0.62} z={0.48} h={2.05} />
        <Post x={ 0.62} z={0.48} h={2.05} />
        <Awning w={1.42} d={0.95} y={1.98} z={0.1} stripes={4} />
        {GOODS.slice(0, 5).map((c, i) => (
          <Box key={i} x={(i - 2) * 0.26} y={0.9} z={0} c={c} />
        ))}
      </group>

      {/* ── Crates stack ── */}
      <group position={[-1.85, 0, 1.1]}>
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[0.52, 0.44, 0.52]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[0.52, 0.44, 0.52]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
        </mesh>
        <Box x={0.52} y={0.24} z={0} c={GOODS[1]} />
        <Box x={0.52} y={0.55} z={0} c={GOODS[3]} />
      </group>

      {/* ── Produce baskets ── */}
      {([[-0.7, 0, 1.65], [0.3, 0, 1.72]] as const).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.28, 0.22, 0.36, 9]} />
            <meshStandardMaterial color={NAMAA.wood} roughness={0.88} />
          </mesh>
          <Box x={0} y={0.46} z={0} c={GOODS[(i + 2) % GOODS.length]} s={0.24} />
        </group>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════
   TIER 3 — السوق الكبير
   سوق فاخر: مبنى رئيسي + قبة + أعمدة + بسطتان + أعلام
   ════════════════════════════════════════════════════ */
function GrandMarket() {
  const mW = 3.8, mD = 2.6, mH = 2.9;

  return (
    <group>
      {/* Paved plaza */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[5.6, 0.08, 5.2]} />
        <meshStandardMaterial color="#d9c27a" roughness={0.88} />
      </mesh>
      {/* Tile pattern */}
      {([-1.6, 0, 1.6] as const).map(x =>
        ([-1.6, 0, 1.6] as const).map(z => (
          <mesh key={`${x}-${z}`} receiveShadow position={[x, 0.05, z]}>
            <boxGeometry args={[1.35, 0.02, 1.35]} />
            <meshStandardMaterial color={(x === 0) === (z === 0) ? '#c8b060' : '#e2d090'} roughness={0.86} />
          </mesh>
        ))
      )}

      {/* ── Main market building ── */}
      <group position={[0, 0, -0.7]}>
        {/* Walls */}
        <mesh castShadow receiveShadow position={[0, mH / 2, 0]}>
          <boxGeometry args={[mW, mH, mD]} />
          <meshStandardMaterial color={WALL} roughness={0.82} />
        </mesh>
        {/* Cornice */}
        <mesh castShadow position={[0, mH + 0.18, 0]}>
          <boxGeometry args={[mW + 0.34, 0.36, mD + 0.34]} />
          <meshStandardMaterial color={WALL2} roughness={0.78} />
        </mesh>
        {/* Hip roof */}
        <group position={[0, mH + 0.36, 0]}>
          <HipRoof w={mW + 0.34} d={mD + 0.34} color={ROOF} />
        </group>

        {/* Dome drum */}
        <mesh castShadow position={[0, mH + 0.52, 0]}>
          <cylinderGeometry args={[0.8, 0.88, 0.96, 14]} />
          <meshStandardMaterial color={NAMAA.white} roughness={0.74} />
        </mesh>
        {/* Dome */}
        <mesh castShadow position={[0, mH + 1.08, 0]}>
          <sphereGeometry args={[0.95, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.54]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.68} roughness={0.28} />
        </mesh>
        {/* Dome spire */}
        <mesh position={[0, mH + 2.06, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.65, 7]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.82} roughness={0.2} />
        </mesh>
        <mesh position={[0, mH + 2.38, 0]}>
          <sphereGeometry args={[0.13, 9, 9]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* 4 front columns */}
        {([-1.35, -0.45, 0.45, 1.35] as const).map((x, i) => (
          <group key={i} position={[x, 0, mD / 2 + 0.38]}>
            <mesh castShadow position={[0, mH * 0.52, 0]}>
              <cylinderGeometry args={[0.19, 0.22, mH * 1.06, 10]} />
              <meshStandardMaterial color={NAMAA.white} roughness={0.74} />
            </mesh>
            {/* Capital */}
            <mesh castShadow position={[0, mH * 1.04 - 0.12, 0]}>
              <cylinderGeometry args={[0.27, 0.19, 0.26, 10]} />
              <meshStandardMaterial color={NAMAA.sand} roughness={0.8} />
            </mesh>
            {/* Base */}
            <mesh castShadow position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.27, 0.27, 0.2, 10]} />
              <meshStandardMaterial color={NAMAA.sand} roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Entablature */}
        <mesh castShadow position={[0, mH + 0.1, mD / 2 + 0.38]}>
          <boxGeometry args={[mW + 0.2, 0.3, 0.38]} />
          <meshStandardMaterial color={WALL2} roughness={0.8} />
        </mesh>

        {/* Arched entrance */}
        <mesh position={[0, 0.9, mD / 2 + 0.02]}>
          <boxGeometry args={[0.78, 1.8, 0.14]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.84} />
        </mesh>
        {/* Arch frame */}
        <mesh position={[0, 1.9, mD / 2 + 0.05]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.4, 0.1, 8, 18, Math.PI]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.55} roughness={0.38} />
        </mesh>

        {/* Windows */}
        <Win x={-1.35} y={1.72} z={mD / 2 + 0.06} w={0.58} h={0.68} />
        <Win x={ 1.35} y={1.72} z={mD / 2 + 0.06} w={0.58} h={0.68} />

        {/* Sign */}
        <mesh castShadow position={[0, mH + 0.04, mD / 2 + 0.2]}>
          <boxGeometry args={[2.1, 0.36, 0.1]} />
          <meshStandardMaterial color={NAMAA.amberDeep} roughness={0.68} />
        </mesh>
        <mesh position={[0, mH + 0.04, mD / 2 + 0.26]}>
          <boxGeometry args={[2.08, 0.12, 0.05]} />
          <meshStandardMaterial color={NAMAA.gold} metalness={0.6} roughness={0.34} />
        </mesh>
      </group>

      {/* ── Left stall ── */}
      <group position={[-2.25, 0, 0.72]}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 0.48, 0.7]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 0.76, 0]}>
          <boxGeometry args={[1.48, 0.08, 0.76]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.8} />
        </mesh>
        <Post x={-0.66} z={0.5}  h={2.1} />
        <Post x={ 0.66} z={0.5}  h={2.1} />
        <Post x={-0.66} z={-0.5} h={2.1} />
        <Post x={ 0.66} z={-0.5} h={2.1} />
        <Awning w={1.5} d={1.05} y={2.04} z={0.08} stripes={5} />
        {GOODS.map((c, i) => (
          <Box key={i} x={(i - 2) * 0.28} y={0.9} z={0} c={c} />
        ))}
        {/* Mini back wall */}
        <mesh castShadow receiveShadow position={[0, 0.85, -0.5]}>
          <boxGeometry args={[1.42, 1.7, 0.18]} />
          <meshStandardMaterial color={WALL} roughness={0.87} />
        </mesh>
        {/* Shelf */}
        <mesh castShadow position={[0, 1.15, -0.4]}>
          <boxGeometry args={[1.3, 0.07, 0.24]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
        {GOODS.slice(0, 4).map((c, i) => (
          <Box key={i} x={(i - 1.5) * 0.32} y={1.3} z={-0.4} c={c} s={0.22} />
        ))}
      </group>

      {/* ── Right stall ── */}
      <group position={[2.25, 0, 0.72]}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 0.48, 0.7]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 0.76, 0]}>
          <boxGeometry args={[1.48, 0.08, 0.76]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.8} />
        </mesh>
        <Post x={-0.66} z={0.5}  h={2.1} />
        <Post x={ 0.66} z={0.5}  h={2.1} />
        <Post x={-0.66} z={-0.5} h={2.1} />
        <Post x={ 0.66} z={-0.5} h={2.1} />
        <Awning w={1.5} d={1.05} y={2.04} z={0.08} stripes={5} />
        {GOODS.map((c, i) => (
          <Box key={i} x={(i - 2) * 0.28} y={0.9} z={0} c={c} />
        ))}
        <mesh castShadow receiveShadow position={[0, 0.85, -0.5]}>
          <boxGeometry args={[1.42, 1.7, 0.18]} />
          <meshStandardMaterial color={WALL} roughness={0.87} />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.4]}>
          <boxGeometry args={[1.3, 0.07, 0.24]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
        {GOODS.slice(0, 4).map((c, i) => (
          <Box key={i} x={(i - 1.5) * 0.32} y={1.3} z={-0.4} c={c} s={0.22} />
        ))}
      </group>

      {/* ── Front display crates ── */}
      {([[-1.1, 0, 1.85], [0.1, 0, 1.92], [1.3, 0, 1.85]] as const).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.5, 0.44, 0.5]} />
            <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
          </mesh>
          <Box x={0} y={0.56} z={0} c={GOODS[i % GOODS.length]} />
        </group>
      ))}

      {/* ── Produce baskets ── */}
      {([-0.3, 0.6] as const).map((x, i) => (
        <group key={i} position={[x, 0, 1.9]}>
          <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.26, 0.2, 0.38, 9]} />
            <meshStandardMaterial color={NAMAA.wood} roughness={0.88} />
          </mesh>
          <Box x={0} y={0.5} z={0} c={GOODS[(i + 2) % GOODS.length]} s={0.22} />
        </group>
      ))}

      {/* ── Flag poles ── */}
      {([-2.65, 2.65] as const).map((x, i) => (
        <group key={i} position={[x, 0, -1.9]}>
          <mesh castShadow position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.055, 0.065, 3.8, 7]} />
            <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.85} />
          </mesh>
          {/* Banner */}
          <mesh castShadow position={[0.35, 3.18, 0]}>
            <boxGeometry args={[0.7, 0.48, 0.05]} />
            <meshStandardMaterial color={i === 0 ? NAMAA.amber : NAMAA.amberDeep} roughness={0.74} />
          </mesh>
          {/* Gold finial */}
          <mesh position={[0, 3.84, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={NAMAA.gold} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ── Floating gold coin (investment symbol) ── */}
      <Floating height={0.28} speed={2.2} yOffset={5.2}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.07, 22]} />
          <meshStandardMaterial
            color={NAMAA.goldLight}
            metalness={0.9}
            roughness={0.14}
            emissive={NAMAA.gold}
            emissiveIntensity={0.55}
          />
        </mesh>
      </Floating>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════ */
export function Market({ tier, level, position }: {
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
        <BuildingTooltip bKey="market" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.amber} />

        <TierGroup active={tier === 1}><MarketStall /></TierGroup>
        <TierGroup active={tier === 2}><MarketShop /></TierGroup>
        <TierGroup active={tier === 3}><GrandMarket /></TierGroup>
      </group>
    </group>
  );
}
