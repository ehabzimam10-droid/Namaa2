import { useState } from 'react';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift, Floating } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

/* ─── palette ─── */
const SOIL    = '#5c3d1e';
const SOIL2   = '#3d2510';
const BARN    = '#b03a2e';
const WHEAT   = '#c8a84b';
const LEAF    = '#2d7d46';
const FENCE   = NAMAA.woodDark;

/* ─── helpers ─── */

/** 3×3 patch of small crops */
function CropPatch({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0.22, z]}>
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3) - 1;
        const col = (i % 3) - 1;
        const h = 0.22 + (i % 3) * 0.07;
        return (
          <mesh key={i} castShadow position={[col * 0.21, h / 2, row * 0.21]}>
            <cylinderGeometry args={[0.055, 0.055, h, 5]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Row of wheat stalks */
function WheatRow({ x, z, len }: { x: number; z: number; len: number }) {
  const count = Math.floor(len / 0.3);
  return (
    <group position={[x, 0, z]}>
      {Array.from({ length: count }, (_, i) => {
        const px = (i / (count - 1) - 0.5) * len;
        const h  = 0.4 + (i % 3) * 0.07;
        return (
          <group key={i} position={[px, 0, 0]}>
            <mesh castShadow position={[0, h / 2, 0]}>
              <cylinderGeometry args={[0.04, 0.05, h, 4]} />
              <meshStandardMaterial color={WHEAT} roughness={0.9} />
            </mesh>
            <mesh castShadow position={[0, h + 0.1, 0]}>
              <coneGeometry args={[0.08, 0.2, 4]} />
              <meshStandardMaterial color={WHEAT} roughness={0.85} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Simple fruit tree */
function FruitTree({ x, z, sc = 1 }: { x: number; z: number; sc?: number }) {
  return (
    <group position={[x, 0, z]} scale={sc}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.11, 0.15, 1.0, 6]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color={LEAF} roughness={0.85} />
      </mesh>
      {[0, 1, 2, 3, 4].map(j => {
        const a = (j / 5) * Math.PI * 2;
        return (
          <mesh key={j} castShadow position={[Math.cos(a) * 0.42, 1.28, Math.sin(a) * 0.42]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#e74c3c" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Sunflower */
function Sunflower({ x, z, h = 1.0 }: { x: number; z: number; h?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.06, h, 5]} />
        <meshStandardMaterial color={LEAF} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, h + 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.085, 4, 8]} />
        <meshStandardMaterial color="#f4d03f" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, h + 0.06, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.06, 10]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Fence side (along X axis, centered at given position) */
function FenceSide({ x, z, len, rotY = 0 }: { x: number; z: number; len: number; rotY?: number }) {
  const posts = Math.ceil(len / 0.75) + 1;
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {Array.from({ length: posts }, (_, i) => (
        <mesh key={i} castShadow position={[(i / (posts - 1) - 0.5) * len, 0.42, 0]}>
          <boxGeometry args={[0.09, 0.84, 0.09]} />
          <meshStandardMaterial color={FENCE} roughness={0.95} />
        </mesh>
      ))}
      {[0.22, 0.52].map((y, i) => (
        <mesh key={i} castShadow position={[0, y, 0]}>
          <boxGeometry args={[len, 0.065, 0.065]} />
          <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Barn with gabled roof */
function Barn({ x, z, sc = 1 }: { x: number; z: number; sc?: number }) {
  const bW = 1.5 * sc, bD = 1.7 * sc, bH = 1.3 * sc;
  return (
    <group position={[x, 0, z]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, bH / 2, 0]}>
        <boxGeometry args={[bW, bH, bD]} />
        <meshStandardMaterial color={BARN} roughness={0.82} />
      </mesh>
      {/* White trim on front face */}
      <mesh castShadow position={[bW / 2, bH / 2, 0]}>
        <boxGeometry args={[0.055, bH, bD + 0.02]} />
        <meshStandardMaterial color="#ecf0f1" roughness={0.7} />
      </mesh>
      {/* Door */}
      <mesh position={[bW / 2 + 0.01, bH * 0.36, 0]}>
        <boxGeometry args={[0.08, bH * 0.72, bD * 0.42]} />
        <meshStandardMaterial color="#1a0800" roughness={1} />
      </mesh>
      {/* Gabled roof panels */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} castShadow
              position={[0, bH + 0.18, side * bD * 0.27]}
              rotation={[side * -0.55, 0, 0]}>
          <boxGeometry args={[bW + 0.14, 0.1, bD * 0.56]} />
          <meshStandardMaterial color="#1e2a1a" roughness={0.85} />
        </mesh>
      ))}
      {/* Ridge beam */}
      <mesh castShadow position={[0, bH + 0.44, 0]}>
        <boxGeometry args={[bW + 0.14, 0.1, 0.12]} />
        <meshStandardMaterial color="#131d12" roughness={0.85} />
      </mesh>
      {/* Loft window */}
      <mesh position={[bW / 2 + 0.02, bH * 0.82, 0]}>
        <boxGeometry args={[0.07, 0.32, 0.32]} />
        <meshStandardMaterial color="#aad4f5" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════
   TIER 1 — بذرة الخير
   حديقة صغيرة: 4 أحواض مرتفعة + بئر + سياج
   ═══════════════════════════════════════ */
function SmallGarden() {
  return (
    <group>
      {/* Soil plot */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.6, 0.1, 2.6]} />
        <meshStandardMaterial color={SOIL} roughness={0.96} />
      </mesh>

      {/* 4 raised garden beds with crops */}
      {([[-0.68, -0.68], [0.68, -0.68], [-0.68, 0.68], [0.68, 0.68]] as const).map(([x, z], i) => (
        <group key={i}>
          <mesh castShadow receiveShadow position={[x, 0.14, z]}>
            <boxGeometry args={[0.95, 0.13, 0.95]} />
            <meshStandardMaterial color={SOIL2} roughness={0.95} />
          </mesh>
          <CropPatch x={x} z={z} color={i % 2 === 0 ? LEAF : '#27ae60'} />
        </group>
      ))}

      {/* Simple well at centre */}
      <group>
        <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.56, 10]} />
          <meshStandardMaterial color={NAMAA.stone} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.07, 10]} />
          <meshStandardMaterial color={NAMAA.water} transparent opacity={0.85} />
        </mesh>
        {[-0.28, 0.28].map((px, i) => (
          <mesh key={i} castShadow position={[px, 0.72, 0]}>
            <boxGeometry args={[0.07, 0.46, 0.07]} />
            <meshStandardMaterial color={FENCE} roughness={0.9} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.97, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.65, 6]} />
          <meshStandardMaterial color={FENCE} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.97, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
        </mesh>
      </group>

      {/* Fence */}
      <FenceSide x={0}     z={-1.35} len={2.8} />
      <FenceSide x={0}     z={ 1.35} len={2.8} />
      <FenceSide x={-1.35} z={0}     len={2.8} rotY={Math.PI / 2} />
      <FenceSide x={ 1.35} z={0}     len={2.8} rotY={Math.PI / 2} />
    </group>
  );
}

/* ═══════════════════════════════════════
   TIER 2 — حقل النماء
   مزرعة متوسطة: صفوف قمح + حظيرة + أشجار فاكهة + قناة ري
   ═══════════════════════════════════════ */
function GrowingFarm() {
  return (
    <group>
      {/* Soil base */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[4.0, 0.1, 4.0]} />
        <meshStandardMaterial color={SOIL} roughness={0.96} />
      </mesh>

      {/* Tilled rows (raised soil strips) */}
      {[-1.1, -0.55, 0, 0.55, 1.1].map((z, i) => (
        <mesh key={i} receiveShadow position={[0.5, 0.1, z]}>
          <boxGeometry args={[2.2, 0.06, 0.38]} />
          <meshStandardMaterial color={SOIL2} roughness={0.95} />
        </mesh>
      ))}

      {/* Wheat rows */}
      {[-1.1, -0.55, 0, 0.55, 1.1].map((z, i) => (
        <WheatRow key={i} x={0.5} z={z} len={2.0} />
      ))}

      {/* Irrigation channels */}
      {[-0.83, 0.27].map((z, i) => (
        <mesh key={i} receiveShadow position={[0.5, 0.12, z]}>
          <boxGeometry args={[2.3, 0.05, 0.13]} />
          <meshStandardMaterial color={NAMAA.water} transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Barn */}
      <Barn x={-1.45} z={0.1} sc={0.88} />

      {/* Fruit trees */}
      <FruitTree x={1.6} z={-1.6} sc={0.85} />
      <FruitTree x={1.6} z={ 1.6} sc={0.95} />
      <FruitTree x={-1.6} z={1.6} sc={0.80} />

      {/* Haystack */}
      <group position={[-1.5, 0, -1.4]}>
        <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.42, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color={WHEAT} roughness={0.95} />
        </mesh>
        <mesh receiveShadow position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.42, 0.45, 0.16, 10]} />
          <meshStandardMaterial color={WHEAT} roughness={0.95} />
        </mesh>
      </group>

      {/* Fence */}
      <FenceSide x={0}    z={-2.1} len={4.4} />
      <FenceSide x={0}    z={ 2.1} len={4.4} />
      <FenceSide x={-2.1} z={0}    len={4.4} rotY={Math.PI / 2} />
      <FenceSide x={ 2.1} z={0}    len={4.4} rotY={Math.PI / 2} />
    </group>
  );
}

/* ═══════════════════════════════════════
   TIER 3 — واحة الخير
   مزرعة مزدهرة: حظيرة كبيرة + صومعة + برج ماء + دوار شمس + أشجار وافرة
   ═══════════════════════════════════════ */
function FlourishingFarm() {
  return (
    <group>
      {/* Soil base */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[5.2, 0.1, 5.2]} />
        <meshStandardMaterial color={SOIL} roughness={0.96} />
      </mesh>

      {/* Tilled rows */}
      {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((z, i) => (
        <mesh key={i} receiveShadow position={[0.6, 0.1, z]}>
          <boxGeometry args={[2.6, 0.07, 0.37]} />
          <meshStandardMaterial color={SOIL2} roughness={0.95} />
        </mesh>
      ))}

      {/* Wheat rows */}
      {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((z, i) => (
        <WheatRow key={i} x={0.6} z={z} len={2.4} />
      ))}

      {/* Irrigation channels */}
      {[-1.25, -0.25, 0.75].map((z, i) => (
        <mesh key={i} receiveShadow position={[0.6, 0.12, z]}>
          <boxGeometry args={[2.8, 0.055, 0.13]} />
          <meshStandardMaterial color={NAMAA.water} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Main irrigation trunk */}
      <mesh receiveShadow position={[-0.18, 0.12, 0]}>
        <boxGeometry args={[0.13, 0.055, 3.4]} />
        <meshStandardMaterial color={NAMAA.water} transparent opacity={0.75} />
      </mesh>

      {/* Big barn */}
      <Barn x={-1.85} z={0.4} sc={1.1} />

      {/* Silo */}
      <group position={[-1.85, 0, -1.35]}>
        <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 2.2, 12]} />
          <meshStandardMaterial color="#e8e0d0" roughness={0.8} />
        </mesh>
        {[0.3, 0.8, 1.3, 1.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.61, 0.61, 0.07, 12]} />
            <meshStandardMaterial color="#b0a898" roughness={0.85} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 2.4, 0]}>
          <coneGeometry args={[0.62, 0.65, 12]} />
          <meshStandardMaterial color={BARN} roughness={0.8} />
        </mesh>
      </group>

      {/* Water tower */}
      <group position={[2.0, 0, -2.0]}>
        <mesh castShadow receiveShadow position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.52, 0.56, 1.0, 10]} />
          <meshStandardMaterial color="#8fa8c8" roughness={0.72} />
        </mesh>
        <mesh castShadow position={[0, 2.68, 0]}>
          <coneGeometry args={[0.58, 0.38, 10]} />
          <meshStandardMaterial color="#5a7a9a" roughness={0.78} />
        </mesh>
        {[0, 1, 2, 3].map(j => {
          const a = j * Math.PI / 2 + Math.PI / 4;
          return (
            <mesh key={j} castShadow position={[Math.cos(a) * 0.36, 0.9, Math.sin(a) * 0.36]}>
              <cylinderGeometry args={[0.045, 0.055, 1.8, 6]} />
              <meshStandardMaterial color={FENCE} roughness={0.9} />
            </mesh>
          );
        })}
        {/* Cross bracing */}
        <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.75, 0.06, 0.06]} />
          <meshStandardMaterial color={FENCE} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.75, 0.06, 0.06]} />
          <meshStandardMaterial color={FENCE} roughness={0.9} />
        </mesh>
      </group>

      {/* Fruit trees */}
      <FruitTree x={2.0} z={1.4} sc={1.1} />
      <FruitTree x={2.0} z={0.3} sc={0.9} />
      <FruitTree x={-2.3} z={-1.4} sc={1.05} />
      <FruitTree x={-2.3} z={1.8} sc={0.95} />

      {/* Sunflower row along right edge */}
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((z, i) => (
        <Sunflower key={i} x={2.1} z={z} h={0.9 + (i % 3) * 0.11} />
      ))}

      {/* Floating golden light above farm (abundance particle) */}
      <Floating height={0.25} speed={1.8} yOffset={2.8}>
        <mesh>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial
            color={NAMAA.goldLight}
            emissive={NAMAA.gold}
            emissiveIntensity={0.9}
            transparent
            opacity={0.75}
          />
        </mesh>
      </Floating>

      {/* Fence */}
      <FenceSide x={0}    z={-2.65} len={5.5} />
      <FenceSide x={0}    z={ 2.65} len={5.5} />
      <FenceSide x={-2.65} z={0}    len={5.5} rotY={Math.PI / 2} />
      <FenceSide x={ 2.65} z={0}    len={5.5} rotY={Math.PI / 2} />
    </group>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════ */
export function Farm({ tier, level, position }: {
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
        <BuildingTooltip bKey="farm" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.emerald} />

        <TierGroup active={tier === 1}><SmallGarden /></TierGroup>
        <TierGroup active={tier === 2}><GrowingFarm /></TierGroup>
        <TierGroup active={tier === 3}><FlourishingFarm /></TierGroup>
      </group>
    </group>
  );
}
