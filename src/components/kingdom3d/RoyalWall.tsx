import * as THREE from 'three';
import { TierGroup } from './utils';
import { KINGDOM } from './palette';

interface Props {
  level: number;
}

const radius = 30;
const segments = 12;
const GATE_IDX = 0; // wall segment index reserved for the gate opening

// Segment width ≈ chord length = 2*30*sin(π/12) ≈ 15.53 → use 15.6 to ensure no gaps
const SEG_W = 15.6;
const HALF  = SEG_W / 2; // 7.8 — tower sits at segment edge

// Dimensions per tier
const WALL = {
  1: { w: SEG_W, h: 2,  d: 1,   gY: 1, towerR: [0.8,  1.0], towerH: 3  },
  2: { w: SEG_W, h: 4,  d: 1.5, gY: 2, towerR: [1.5,  1.8], towerH: 6  },
  3: { w: SEG_W, h: 6,  d: 2,   gY: 3, towerR: [2.0,  2.5], towerH: 10 },
} as const;

/** Gate opening width for each tier */
const GATE_W = { 1: 4, 2: 5, 3: 6 } as const;

export function RoyalWall({ level }: Props) {
  const tier = (level <= 2 ? 1 : level <= 4 ? 2 : 3) as 1 | 2 | 3;

  return (
    <group position={[0, -0.5, 0]}>

      {/* ──────────── TIER 1 ──────────── */}
      <TierGroup active={tier === 1}>
        {[...Array(segments)].map((_, i) => {
          const angle  = (i / segments) * Math.PI * 2;
          const x      = Math.cos(angle) * radius;
          const z      = Math.sin(angle) * radius;
          const isGate = i === GATE_IDX;
          const d      = WALL[1];

          return (
            <group key={i} position={[x, d.gY, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
              {/* Wall panel — hidden at gate segment */}
              {!isGate && (
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[d.w, d.h, d.d]} />
                  <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.9} />
                </mesh>
              )}

              {/* Corner pillar */}
              <mesh castShadow receiveShadow position={[HALF, 0.5, 0]}>
                <cylinderGeometry args={[d.towerR[0], d.towerR[1], d.towerH, 6]} />
                <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} />
              </mesh>
              <mesh castShadow position={[HALF, d.towerH / 2 + 0.75, 0]}>
                <coneGeometry args={[d.towerR[1] + 0.1, 1.5, 6]} />
                <meshStandardMaterial color={KINGDOM.stoneDark} />
              </mesh>

              {/* ── Gate Tier 1: simple stone arch ── */}
              {isGate && (
                <group position={[0, -d.gY, 0]}>
                  {/* Left pillar */}
                  <mesh castShadow receiveShadow position={[-GATE_W[1] / 2 - 0.5, 1.5, 0]}>
                    <cylinderGeometry args={[0.7, 0.9, 3, 8]} />
                    <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} />
                  </mesh>
                  {/* Right pillar */}
                  <mesh castShadow receiveShadow position={[GATE_W[1] / 2 + 0.5, 1.5, 0]}>
                    <cylinderGeometry args={[0.7, 0.9, 3, 8]} />
                    <meshStandardMaterial color={KINGDOM.stone} roughness={0.8} />
                  </mesh>
                  {/* Lintel beam */}
                  <mesh castShadow receiveShadow position={[0, 3.3, 0]}>
                    <boxGeometry args={[GATE_W[1] + 2.5, 0.7, d.d + 0.2]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.85} />
                  </mesh>
                  {/* Left door half */}
                  <mesh castShadow position={[-GATE_W[1] / 4, 1.5, 0.1]}>
                    <boxGeometry args={[GATE_W[1] / 2 - 0.1, 3, 0.15]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={1} />
                  </mesh>
                  {/* Right door half */}
                  <mesh castShadow position={[GATE_W[1] / 4, 1.5, 0.1]}>
                    <boxGeometry args={[GATE_W[1] / 2 - 0.1, 3, 0.15]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={1} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
      </TierGroup>

      {/* ──────────── TIER 2 ──────────── */}
      <TierGroup active={tier === 2}>
        {[...Array(segments)].map((_, i) => {
          const angle  = (i / segments) * Math.PI * 2;
          const x      = Math.cos(angle) * radius;
          const z      = Math.sin(angle) * radius;
          const isGate = i === GATE_IDX;
          const d      = WALL[2];

          return (
            <group key={i} position={[x, d.gY, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
              {/* Wall panel */}
              {!isGate && (
                <>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[d.w, d.h, d.d]} />
                    <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.8} />
                  </mesh>
                  {/* Battlements — 6 to cover full width */}
                  {[...Array(6)].map((_, j) => (
                    <mesh key={j} castShadow position={[-4 + j * 1.6, d.h / 2 + 0.4, 0]}>
                      <boxGeometry args={[0.8, 0.8, d.d + 0.2]} />
                      <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.8} />
                    </mesh>
                  ))}
                </>
              )}

              {/* Corner tower */}
              <mesh castShadow receiveShadow position={[HALF, 1, 0]}>
                <cylinderGeometry args={[d.towerR[0], d.towerR[1], d.towerH, 8]} />
                <meshStandardMaterial color={KINGDOM.marble} roughness={0.7} />
              </mesh>
              <mesh castShadow position={[HALF, d.towerH / 2 + 1.5, 0]}>
                <cylinderGeometry args={[d.towerR[0] + 0.15, d.towerR[0] + 0.15, 0.8, 8]} />
                <meshStandardMaterial color={KINGDOM.stone} />
              </mesh>

              {/* ── Gate Tier 2: stone gatehouse ── */}
              {isGate && (
                <group position={[0, -d.gY, 0]}>
                  {/* Left gate tower */}
                  <mesh castShadow receiveShadow position={[-GATE_W[2] / 2 - 1.2, 3, 0]}>
                    <cylinderGeometry args={[1.3, 1.6, 6, 10]} />
                    <meshStandardMaterial color={KINGDOM.marble} roughness={0.7} />
                  </mesh>
                  <mesh castShadow position={[-GATE_W[2] / 2 - 1.2, 6.4, 0]}>
                    <coneGeometry args={[1.5, 2.5, 10]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
                  </mesh>
                  {/* Right gate tower */}
                  <mesh castShadow receiveShadow position={[GATE_W[2] / 2 + 1.2, 3, 0]}>
                    <cylinderGeometry args={[1.3, 1.6, 6, 10]} />
                    <meshStandardMaterial color={KINGDOM.marble} roughness={0.7} />
                  </mesh>
                  <mesh castShadow position={[GATE_W[2] / 2 + 1.2, 6.4, 0]}>
                    <coneGeometry args={[1.5, 2.5, 10]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
                  </mesh>
                  {/* Arch / lintel */}
                  <mesh castShadow receiveShadow position={[0, 5, 0]}>
                    <boxGeometry args={[GATE_W[2] + 3.5, 1.2, d.d + 0.4]} />
                    <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.8} />
                  </mesh>
                  {/* Portcullis bars */}
                  {[-1.5, -0.5, 0.5, 1.5].map((xOff, j) => (
                    <mesh key={j} position={[xOff, 2.2, 0]}>
                      <boxGeometry args={[0.12, 4, 0.12]} />
                      <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.9} />
                    </mesh>
                  ))}
                  {/* Portcullis horizontal bar */}
                  <mesh position={[0, 4, 0]}>
                    <boxGeometry args={[GATE_W[2] - 0.3, 0.15, 0.15]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.9} />
                  </mesh>
                  <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[GATE_W[2] - 0.3, 0.15, 0.15]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.9} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
      </TierGroup>

      {/* ──────────── TIER 3 ──────────── */}
      <TierGroup active={tier === 3}>
        {[...Array(segments)].map((_, i) => {
          const angle  = (i / segments) * Math.PI * 2;
          const x      = Math.cos(angle) * radius;
          const z      = Math.sin(angle) * radius;
          const isGate = i === GATE_IDX;
          const d      = WALL[3];

          return (
            <group key={i} position={[x, d.gY, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
              {/* Wall panel */}
              {!isGate && (
                <>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[d.w, d.h, d.d]} />
                    <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
                  </mesh>
                  {/* Gold trim top */}
                  <mesh position={[0, d.h / 2 + 0.1, d.d / 2 + 0.2]}>
                    <boxGeometry args={[d.w, 0.2, 0.4]} />
                    <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
                  </mesh>
                  {/* Glow line */}
                  <mesh position={[0, d.h / 2 - 1, d.d / 2 + 0.05]}>
                    <boxGeometry args={[d.w, 0.1, 0.08]} />
                    <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.8} />
                  </mesh>
                </>
              )}

              {/* Massive corner tower */}
              <group position={[HALF, 2, 0]}>
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[d.towerR[0], d.towerR[1], d.towerH, 12]} />
                  <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
                </mesh>
                {/* Gold dome */}
                <mesh castShadow position={[0, 5.5, 0]}>
                  <sphereGeometry args={[d.towerR[0] + 0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Spire */}
                <mesh castShadow position={[0, 7, 0]}>
                  <cylinderGeometry args={[0.08, 0.18, 3, 8]} />
                  <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.7} />
                </mesh>
              </group>

              {/* ── Gate Tier 3: grand royal gatehouse ── */}
              {isGate && (
                <group position={[0, -d.gY, 0]}>
                  {/* Left gate tower */}
                  <group position={[-GATE_W[3] / 2 - 1.8, 0, 0]}>
                    <mesh castShadow receiveShadow position={[0, 5.5, 0]}>
                      <cylinderGeometry args={[2, 2.5, 11, 12]} />
                      <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
                    </mesh>
                    <mesh castShadow position={[0, 11.5, 0]}>
                      <sphereGeometry args={[2.2, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                      <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05} />
                    </mesh>
                    <mesh castShadow position={[0, 13.2, 0]}>
                      <cylinderGeometry args={[0.1, 0.2, 3.5, 8]} />
                      <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.8} />
                    </mesh>
                    {/* Gold trim ring */}
                    <mesh position={[0, 8, 0]}>
                      <torusGeometry args={[2.05, 0.18, 8, 24]} />
                      <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.15} />
                    </mesh>
                  </group>

                  {/* Right gate tower */}
                  <group position={[GATE_W[3] / 2 + 1.8, 0, 0]}>
                    <mesh castShadow receiveShadow position={[0, 5.5, 0]}>
                      <cylinderGeometry args={[2, 2.5, 11, 12]} />
                      <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
                    </mesh>
                    <mesh castShadow position={[0, 11.5, 0]}>
                      <sphereGeometry args={[2.2, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                      <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05} />
                    </mesh>
                    <mesh castShadow position={[0, 13.2, 0]}>
                      <cylinderGeometry args={[0.1, 0.2, 3.5, 8]} />
                      <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 8, 0]}>
                      <torusGeometry args={[2.05, 0.18, 8, 24]} />
                      <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.15} />
                    </mesh>
                  </group>

                  {/* Upper gatehouse connecting the two towers */}
                  <mesh castShadow receiveShadow position={[0, 8, 0]}>
                    <boxGeometry args={[GATE_W[3] + 0.8, 3, d.d + 0.6]} />
                    <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
                  </mesh>
                  {/* Gold trim on gatehouse */}
                  <mesh position={[0, 9.6, d.d / 2 + 0.55]}>
                    <boxGeometry args={[GATE_W[3] + 0.8, 0.2, 0.4]} />
                    <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
                  </mesh>

                  {/* Grand arch frame */}
                  <mesh castShadow receiveShadow position={[0, 6, 0]}>
                    <boxGeometry args={[GATE_W[3] + 4.5, 1, d.d + 0.8]} />
                    <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.75} />
                  </mesh>
                  {/* Gold arch accent */}
                  <mesh position={[0, 6.55, d.d / 2 + 0.55]}>
                    <boxGeometry args={[GATE_W[3] + 4.5, 0.15, 0.3]} />
                    <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
                  </mesh>

                  {/* Glowing portal fill */}
                  <mesh position={[0, 3, 0.05]}>
                    <planeGeometry args={[GATE_W[3] - 0.3, 5.8]} />
                    <meshBasicMaterial
                      color={KINGDOM.crystalGlow}
                      transparent
                      opacity={0.25}
                      blending={THREE.AdditiveBlending}
                      side={THREE.DoubleSide}
                    />
                  </mesh>

                  {/* Glowing gold trim line on arch sides */}
                  <mesh position={[-GATE_W[3] / 2, 3, d.d / 2 + 0.06]}>
                    <boxGeometry args={[0.12, 6, 0.1]} />
                    <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.9} />
                  </mesh>
                  <mesh position={[GATE_W[3] / 2, 3, d.d / 2 + 0.06]}>
                    <boxGeometry args={[0.12, 6, 0.1]} />
                    <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.9} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
      </TierGroup>

    </group>
  );
}
