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

/* ── shared primitives ── */

/** Round topiary ball on a trunk */
function Topiary({ x, z, y = 0, trunkH = 0.9, r = 0.55, color = '#2D6A2D' }:
  { x: number; z: number; y?: number; trunkH?: number; r?: number; color?: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[0, trunkH / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.14, trunkH, 6]} />
        <meshStandardMaterial color="#3E2A1A" roughness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, trunkH + r * 0.8, 0]}>
        <sphereGeometry args={[r, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Tall cypress-style tree */
function CypressTree({ x, z, y = 0, h = 3.0, color = KINGDOM.emeraldDeep }:
  { x: number; z: number; y?: number; h?: number; color?: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[0, h * 0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, h * 0.4, 6]} />
        <meshStandardMaterial color="#3E2A1A" roughness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, h * 0.62, 0]}>
        <coneGeometry args={[h * 0.22, h * 0.85, 8]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
    </group>
  );
}

/** Round flowering tree */
function FlowerTree({ x, z, y = 0, trunkH = 1.1, r = 0.7, leafColor = KINGDOM.emerald, flowerColor = '#F9A8D4' }:
  { x: number; z: number; y?: number; trunkH?: number; r?: number; leafColor?: string; flowerColor?: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[0, trunkH / 2, 0]}>
        <cylinderGeometry args={[0.11, 0.16, trunkH, 7]} />
        <meshStandardMaterial color="#4A3020" roughness={0.95} />
      </mesh>
      {/* Leaf canopy */}
      <mesh castShadow receiveShadow position={[0, trunkH + r * 0.78, 0]}>
        <sphereGeometry args={[r, 10, 10]} />
        <meshStandardMaterial color={leafColor} roughness={0.82} />
      </mesh>
      {/* Flower dots on canopy surface */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        const fr = r * 0.85;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * fr * 0.7, trunkH + r * 0.78 + Math.sin(a * 0.5) * fr * 0.3, Math.sin(a) * fr * 0.7]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color={flowerColor} roughness={0.7} emissive={flowerColor} emissiveIntensity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Hedge row — trimmed rectangular bush */
function Hedge({ x, z, y = 0, w, d, h, color = '#1B5E20' }:
  { x: number; z: number; y?: number; w: number; d: number; h: number; color?: string }) {
  return (
    <mesh castShadow receiveShadow position={[x, y + h / 2, z]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );
}

/** Flower bed — flat colored ground patch */
function FlowerBed({ x, z, y = 0, w, d, color }:
  { x: number; z: number; y?: number; w: number; d: number; color: string }) {
  return (
    <mesh receiveShadow position={[x, y + 0.04, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

/** Central fountain */
function Fountain({ y = 0, scale = 1 }: { y?: number; scale?: number }) {
  const s = scale;
  return (
    <group position={[0, y, 0]}>
      {/* Lower basin */}
      <mesh castShadow receiveShadow position={[0, s * 0.22, 0]}>
        <cylinderGeometry args={[s * 1.1, s * 1.3, s * 0.44, 14]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
      </mesh>
      {/* Water surface in lower basin */}
      <mesh receiveShadow position={[0, s * 0.46, 0]}>
        <cylinderGeometry args={[s * 1.0, s * 1.0, s * 0.06, 14]} />
        <meshStandardMaterial color={KINGDOM.crystal} roughness={0.05}
          emissive={KINGDOM.crystalGlow} emissiveIntensity={0.4} transparent opacity={0.82} />
      </mesh>
      {/* Central column */}
      <mesh castShadow receiveShadow position={[0, s * 0.9, 0]}>
        <cylinderGeometry args={[s * 0.18, s * 0.28, s * 1.0, 10]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
      </mesh>
      {/* Upper basin */}
      <mesh castShadow receiveShadow position={[0, s * 1.42, 0]}>
        <cylinderGeometry args={[s * 0.62, s * 0.72, s * 0.3, 14]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.48} />
      </mesh>
      {/* Upper water surface */}
      <mesh receiveShadow position={[0, s * 1.59, 0]}>
        <cylinderGeometry args={[s * 0.56, s * 0.56, s * 0.05, 14]} />
        <meshStandardMaterial color={KINGDOM.crystal} roughness={0.05}
          emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} transparent opacity={0.78} />
      </mesh>
      {/* Gold finial */}
      <mesh castShadow position={[0, s * 1.78, 0]}>
        <sphereGeometry args={[s * 0.16, 10, 10]} />
        <meshStandardMaterial color={KINGDOM.gold} metalness={0.9} roughness={0.1}
          emissive={KINGDOM.goldGlow} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** Stone garden path strip */
function Path({ x, z, y = 0, w, d, rot = 0 }:
  { x: number; z: number; y?: number; w: number; d: number; rot?: number }) {
  return (
    <mesh receiveShadow position={[x, y + 0.03, z]} rotation={[-Math.PI / 2, rot, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.75} />
    </mesh>
  );
}

/* ══════════════════════════════════════════ */
export function RoyalGardens({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef  = useHoverLift(hovered);
  const petalRef1 = React.useRef<THREE.Group>(null);
  const petalRef2 = React.useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (petalRef1.current) petalRef1.current.rotation.y = t * 0.22;
    if (petalRef2.current) petalRef2.current.rotation.y = -t * 0.18;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.emerald} />
      <BuildingTooltip buildingKey="garden" level={level} visible={hovered}
        position={[0, tier === 3 ? 7 : tier === 2 ? 5 : 3.5, 0]} />

      {/* ══ TIER 1 — Formal Garden Bed ══
          A small organised garden with 4 quadrants, stone border,
          corner topiaries, and a birdbath fountain.
          Footprint ≈ 5×5                                          */}
      <TierGroup active={tier === 1}>
        {/* Stone border platform — 6.8×6.8 */}
        <mesh receiveShadow position={[0, 0.14, 0]}>
          <boxGeometry args={[6.8, 0.28, 6.8]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.82} />
        </mesh>

        {/* 4 grass quadrants */}
        {[[-1.45, -1.45], [1.45, -1.45], [-1.45, 1.45], [1.45, 1.45]].map(([x, z], i) => (
          <FlowerBed key={i} x={x} z={z} y={0.28} w={2.6} d={2.6}
            color={['#2D6A2D', '#1B5220', '#2D6A2D', '#1B5220'][i]} />
        ))}

        {/* Cross paths */}
        <Path x={0} z={0} y={0.28} w={6.5} d={0.6} />
        <Path x={0} z={0} y={0.28} w={0.6} d={6.5} />

        {/* Gold border trim */}
        {[[-3.4, 0], [3.4, 0], [0, -3.4], [0, 3.4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.29, z]}>
            <boxGeometry args={i < 2 ? [0.15, 0.06, 6.8] : [6.8, 0.06, 0.15]} />
            <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.75} roughness={0.25} />
          </mesh>
        ))}

        {/* Corner topiaries */}
        {[[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]].map(([x, z], i) => (
          <Topiary key={i} x={x} z={z} y={0.28} trunkH={0.8} r={0.55} color="#2A6B2A" />
        ))}

        {/* Small flowers in quadrants */}
        {[[-1.45, -1.45, '#F9A8D4'], [1.45, -1.45, '#FDE68A'], [-1.45, 1.45, '#FDE68A'], [1.45, 1.45, '#F9A8D4']].map(
          ([x, z, c], i) => [[-0.58, -0.58], [0.58, -0.58], [-0.58, 0.58], [0.58, 0.58]].map(([dx, dz], j) => (
            <mesh key={`${i}-${j}`} castShadow position={[Number(x) + dx, 0.48, Number(z) + dz]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshStandardMaterial color={c as string} roughness={0.8} />
            </mesh>
          ))
        )}

        {/* Birdbath fountain */}
        <Fountain y={0.28} scale={0.85} />
      </TierGroup>

      {/* ══ TIER 2 — Blooming Royal Garden ══
          Larger garden with hedges, colonnade pergola,
          multi-tier fountain, flowering trees.
          Footprint ≈ 7×7                                   */}
      <TierGroup active={tier === 2}>
        {/* Stone platform — 9.4×9.4 */}
        <mesh receiveShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[9.4, 0.36, 9.4]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.75} />
        </mesh>
        {/* Gold border */}
        {[[-4.7, 0, true], [4.7, 0, true], [0, -4.7, false], [0, 4.7, false]].map(([x, z, horiz], i) => (
          <mesh key={i} position={[Number(x), 0.37, Number(z)]}>
            <boxGeometry args={horiz ? [0.18, 0.08, 9.4] : [9.4, 0.08, 0.18]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* 4 grass quadrants */}
        {[[-2.1, -2.1], [2.1, -2.1], [-2.1, 2.1], [2.1, 2.1]].map(([x, z], i) => (
          <FlowerBed key={i} x={x} z={z} y={0.36} w={3.6} d={3.6}
            color={['#276B27', '#1A5C1A', '#276B27', '#1A5C1A'][i]} />
        ))}

        {/* Paths */}
        <Path x={0} z={0} y={0.36} w={9.1} d={0.75} />
        <Path x={0} z={0} y={0.36} w={0.75} d={9.1} />

        {/* Hedge borders around quadrants */}
        {[[-2.1, -4.0], [2.1, -4.0], [-2.1, 4.0], [2.1, 4.0]].map(([x, z], i) => (
          <Hedge key={`hn${i}`} x={x} z={z} y={0.36} w={3.6} d={0.38} h={0.7} />
        ))}
        {[[-4.0, -2.1], [4.0, -2.1], [-4.0, 2.1], [4.0, 2.1]].map(([x, z], i) => (
          <Hedge key={`hv${i}`} x={x} z={z} y={0.36} w={0.38} d={3.6} h={0.7} />
        ))}

        {/* Flower beds — natural dark soil, flowers as small spheres above */}
        {[[-2.1, -2.1], [2.1, -2.1], [-2.1, 2.1], [2.1, 2.1]].map(([x, z], i) => (
          <FlowerBed key={i} x={x} z={z} y={0.36} w={2.1} d={2.1} color="#3A2010" />
        ))}
        {([[-2.1,-2.1,'#F9A8D4'],[2.1,-2.1,'#FDE68A'],[-2.1,2.1,'#C4B5FD'],[2.1,2.1,'#FCA5A5']] as [number,number,string][]).map(
          ([x, z, c], i) => ([-0.62, 0, 0.62] as number[]).map((dx) =>
            ([-0.62, 0, 0.62] as number[]).map((dz, j) => (
              <mesh key={`${i}-${dx}-${j}`} castShadow position={[x + dx, 0.52, z + dz]}>
                <sphereGeometry args={[0.11, 6, 6]} />
                <meshStandardMaterial color={c} roughness={0.85} />
              </mesh>
            ))
          )
        )}

        {/* Corner cypress trees */}
        {[[-3.9, -3.9], [3.9, -3.9], [-3.9, 3.9], [3.9, 3.9]].map(([x, z], i) => (
          <CypressTree key={i} x={x} z={z} y={0.36} h={3.5} color={KINGDOM.emeraldDeep} />
        ))}

        {/* Flowering trees mid-edge */}
        {[[-3.9, 0], [3.9, 0], [0, -3.9], [0, 3.9]].map(([x, z], i) => (
          <FlowerTree key={i} x={x} z={z} y={0.36} trunkH={1.0} r={0.72}
            leafColor={KINGDOM.emerald} flowerColor={['#F9A8D4','#FDE68A','#F9A8D4','#FDE68A'][i]} />
        ))}

        {/* Grand fountain center */}
        <Fountain y={0.36} scale={1.15} />

        {/* Floating petals ring */}
        <group ref={petalRef1}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <Floating key={i} height={0.25} speed={1.2 + i * 0.15} yOffset={2.0 + (i % 3) * 0.4}>
                <mesh position={[Math.cos(a) * 2.3, 0, Math.sin(a) * 2.3]}>
                  <sphereGeometry args={[0.1, 6, 6]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#F9A8D4' : '#FDE68A'}
                    roughness={0.85} />
                </mesh>
              </Floating>
            );
          })}
        </group>
      </TierGroup>

      {/* ══ TIER 3 — Paradise Garden (Char Bagh) ══
          Classic 4-quadrant Islamic paradise garden:
          two crossing water channels, grand central fountain,
          cypress allées, flowering trees, ornate pavilion arches,
          floating golden petals.
          Footprint ≈ 9×9                                           */}
      <TierGroup active={tier === 3}>
        {/* Outer stone platform — 12.4×12.4 */}
        <mesh receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[12.4, 0.44, 12.4]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>
        {/* Outer gold border */}
        {[[-6.2, 0, true], [6.2, 0, true], [0, -6.2, false], [0, 6.2, false]].map(([x, z, h], i) => (
          <mesh key={i} position={[Number(x), 0.45, Number(z)]}>
            <boxGeometry args={h ? [0.2, 0.1, 12.4] : [12.4, 0.1, 0.2]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* 4 large grass quadrants */}
        {[[-2.85, -2.85], [2.85, -2.85], [-2.85, 2.85], [2.85, 2.85]].map(([x, z], i) => (
          <FlowerBed key={i} x={x} z={z} y={0.44} w={4.95} d={4.95}
            color={['#276B27', '#1F5C1F', '#1F5C1F', '#276B27'][i]} />
        ))}

        {/* Water channel paths */}
        <mesh receiveShadow position={[0, 0.46, 0]}>
          <boxGeometry args={[12.4, 0.06, 1.1]} />
          <meshStandardMaterial color={KINGDOM.crystal} transparent opacity={0.7}
            emissive={KINGDOM.crystalGlow} emissiveIntensity={0.25} roughness={0.05} />
        </mesh>
        <mesh receiveShadow position={[0, 0.46, 0]}>
          <boxGeometry args={[1.1, 0.06, 12.4]} />
          <meshStandardMaterial color={KINGDOM.crystal} transparent opacity={0.7}
            emissive={KINGDOM.crystalGlow} emissiveIntensity={0.25} roughness={0.05} />
        </mesh>
        {/* Channel stone edges */}
        {[[-0.57, 0, true], [0.57, 0, true], [0, -0.57, false], [0, 0.57, false]].map(([x, z, h], i) => (
          <mesh key={i} position={[Number(x), 0.45, Number(z)]}>
            <boxGeometry args={h ? [0.08, 0.08, 12.4] : [12.4, 0.08, 0.08]} />
            <meshStandardMaterial color={KINGDOM.goldDeep} metalness={0.75} roughness={0.25} />
          </mesh>
        ))}

        {/* Flower beds — natural dark soil, flowers as spheres above */}
        {[[-2.85, -2.85], [2.85, -2.85], [-2.85, 2.85], [2.85, 2.85]].map(([x, z], i) => (
          <FlowerBed key={i} x={x} z={z} y={0.44} w={3.1} d={3.1} color="#3A2010" />
        ))}
        {([[-2.85,-2.85,'#F9A8D4'],[2.85,-2.85,'#FDE68A'],[-2.85,2.85,'#C4B5FD'],[2.85,2.85,'#FCA5A5']] as [number,number,string][]).map(
          ([x, z, c], qi) => {
            const offsets: [number,number][] = [
              [-0.9,-0.9],[-0.9,0],[-0.9,0.9],
              [0,-0.9],[0,0],[0,0.9],
              [0.9,-0.9],[0.9,0],[0.9,0.9],
            ];
            return offsets.map(([dx, dz], j) => (
              <mesh key={`t3-${qi}-${j}`} castShadow position={[x + dx, 0.58, z + dz]}>
                <sphereGeometry args={[0.12, 6, 6]} />
                <meshStandardMaterial color={c} roughness={0.85} />
              </mesh>
            ));
          }
        )}

        {/* Hedge borders — outer edges of each quadrant */}
        {[[-2.85, -5.5], [2.85, -5.5], [-2.85, 5.5], [2.85, 5.5]].map(([x, z], i) => (
          <Hedge key={`hh${i}`} x={x} z={z} y={0.44} w={4.95} d={0.42} h={0.8} color="#1B5E20" />
        ))}
        {[[-5.5, -2.85], [5.5, -2.85], [-5.5, 2.85], [5.5, 2.85]].map(([x, z], i) => (
          <Hedge key={`hv${i}`} x={x} z={z} y={0.44} w={0.42} d={4.95} h={0.8} color="#1B5E20" />
        ))}

        {/* Cypress allée — pairs along each channel arm */}
        {[[-2.35, -4.15], [2.35, -4.15], [-2.35, 4.15], [2.35, 4.15],
          [-4.15, -2.35], [4.15, -2.35], [-4.15, 2.35], [4.15, 2.35]].map(([x, z], i) => (
          <CypressTree key={i} x={x} z={z} y={0.44} h={4.2} color={KINGDOM.emeraldDeep} />
        ))}

        {/* Flowering trees at outer corners */}
        {[[-5.1, -5.1], [5.1, -5.1], [-5.1, 5.1], [5.1, 5.1]].map(([x, z], i) => (
          <FlowerTree key={i} x={x} z={z} y={0.44} trunkH={1.3} r={0.92}
            leafColor={KINGDOM.emerald} flowerColor={['#F9A8D4','#FDE68A','#FDE68A','#F9A8D4'][i]} />
        ))}

        {/* Mid-edge flowering trees */}
        {[[-5.5, 0], [5.5, 0], [0, -5.5], [0, 5.5]].map(([x, z], i) => (
          <FlowerTree key={`me${i}`} x={x} z={z} y={0.44} trunkH={1.1} r={0.8}
            leafColor="#2D8A2D" flowerColor={i % 2 === 0 ? '#F9A8D4' : '#FDE68A'} />
        ))}

        {/* 4 pavilion arch columns at channel intersections */}
        {[[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]].map(([x, z], i) => (
          <group key={i} position={[x, 0.44, z]}>
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 2.4, 8]} />
              <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
              <boxGeometry args={[0.42, 0.32, 0.42]} />
              <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Arch beams */}
        {[[0, -1.15], [0, 1.15]].map(([x, z], i) => (
          <mesh key={`ab${i}`} castShadow position={[x, 2.72, z]}>
            <boxGeometry args={[2.42, 0.22, 0.18]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
          </mesh>
        ))}
        {[[-1.15, 0], [1.15, 0]].map(([x, z], i) => (
          <mesh key={`abv${i}`} castShadow position={[x, 2.72, z]}>
            <boxGeometry args={[0.18, 0.22, 2.42]} />
            <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
          </mesh>
        ))}
        {/* Gold trim on arch */}
        <mesh position={[0, 2.86, 0]}>
          <boxGeometry args={[2.42, 0.1, 0.1]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, 2.86, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.42]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Grand central fountain */}
        <Fountain y={0.44} scale={1.5} />

        {/* Outer small topiaries along hedge line */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Topiary key={`tp${i}`} x={Math.cos(a) * 5.5} z={Math.sin(a) * 5.5}
              y={0.44} trunkH={0.7} r={0.48} color="#1A5C1A" />
          );
        })}

        {/* Rotating floating petal rings */}
        <group ref={petalRef1}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <Floating key={i} height={0.3} speed={1.1 + i * 0.12} yOffset={2.5 + (i % 4) * 0.35}>
                <mesh position={[Math.cos(a) * 3.1, 0, Math.sin(a) * 3.1]}>
                  <sphereGeometry args={[0.11, 6, 6]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#F9A8D4' : '#FDE68A'} roughness={0.85} />
                </mesh>
              </Floating>
            );
          })}
        </group>
        <group ref={petalRef2}>
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
            return (
              <Floating key={i} height={0.25} speed={1.4 + i * 0.18} yOffset={3.8 + i * 0.3}>
                <mesh position={[Math.cos(a) * 1.8, 0, Math.sin(a) * 1.8]}>
                  <sphereGeometry args={[0.12, 6, 6]} />
                  <meshStandardMaterial color="#6EE7B7" roughness={0.85} />
                </mesh>
              </Floating>
            );
          })}
        </group>
      </TierGroup>
    </group>
  );
}
