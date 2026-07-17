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

/* ─── shared primitives ─── */

function Steps({ w, d: _d, count = 3, color = KINGDOM.marbleDark }: { w: number; d?: number; count?: number; color?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} castShadow receiveShadow
          position={[0, i * 0.28 + 0.14, (count - i) * 0.4]}>
          <boxGeometry args={[w - i * 0.4, 0.28, 0.85]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </mesh>
      ))}
    </>
  );
}

function Column({ x, z, h, r, baseY = 0 }: { x: number; z: number; h: number; r: number; baseY?: number }) {
  return (
    <group position={[x, baseY, z]}>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[r * 2.5, 0.35, r * 2.5]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, h / 2 + 0.35, 0]}>
        <cylinderGeometry args={[r * 0.85, r, h, 10]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, h + 0.55, 0]}>
        <boxGeometry args={[r * 2.8, 0.38, r * 2.8]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Dome({
  y, r, color = KINGDOM.gold, spire = true, spireH = 1.8, drumH = 0,
}: { y: number; r: number; color?: string; spire?: boolean; spireH?: number; drumH?: number }) {
  return (
    <group position={[0, y, 0]}>
      {drumH > 0 && (
        <mesh castShadow receiveShadow position={[0, drumH / 2, 0]}>
          <cylinderGeometry args={[r, r, drumH, 16]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
      )}
      <mesh castShadow receiveShadow position={[0, drumH, 0]}>
        <sphereGeometry args={[r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.1} />
      </mesh>
      {spire && (
        <>
          <mesh castShadow position={[0, drumH + r + 0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.18, spireH, 8]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.9} />
          </mesh>
          <mesh castShadow position={[0, drumH + r + 0.3 + spireH + 0.18, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05}
              emissive={KINGDOM.goldGlow} emissiveIntensity={0.35} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Turret({ x, z, baseY = 0, shaftH, shaftR, roofColor = KINGDOM.purpleDeep, gold = false }:
  { x: number; z: number; baseY?: number; shaftH: number; shaftR: number; roofColor?: string; gold?: boolean }) {
  return (
    <group position={[x, baseY, z]}>
      <mesh castShadow receiveShadow position={[0, shaftH / 2, 0]}>
        <cylinderGeometry args={[shaftR * 0.88, shaftR, shaftH, 10]} />
        <meshStandardMaterial color={KINGDOM.marble} roughness={0.5} />
      </mesh>
      {/* battlement ring */}
      <mesh castShadow receiveShadow position={[0, shaftH + 0.22, 0]}>
        <cylinderGeometry args={[shaftR + 0.12, shaftR, 0.44, 10]} />
        <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
      </mesh>
      {gold ? (
        <Dome y={shaftH + 0.44} r={shaftR + 0.18} color={KINGDOM.gold} spireH={1.2} />
      ) : (
        <>
          <mesh castShadow position={[0, shaftH + 0.44 + (shaftR + 0.18) * 1.05, 0]}>
            <coneGeometry args={[shaftR + 0.22, (shaftR + 0.18) * 2.2, 10]} />
            <meshStandardMaterial color={roofColor} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, shaftH + 0.44 + (shaftR + 0.18) * 1.05 * 2 + 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.14, 1.0, 8]} />
            <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.85} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ─── banner flag ─── */
function Banner({ x, z, y, color = KINGDOM.crimson }: { x: number; z: number; y: number; color?: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
        <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.8} />
      </mesh>
      <mesh castShadow position={[0.55, 2.55, 0]}>
        <boxGeometry args={[1.0, 0.7, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export function GrandPalace({ level, tier }: BuildingProps) {
  const [hovered, setHovered] = React.useState(false);
  const groupRef  = useHoverLift(hovered);
  const crownRef  = React.useRef<THREE.Mesh>(null);
  const haloRef   = React.useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (crownRef.current) crownRef.current.rotation.y = t * 0.35;
    if (haloRef.current)  haloRef.current.rotation.y  = -t * 0.5;
  });

  const tooltipY = tier === 3 ? 22 : tier === 2 ? 14 : 9;

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <ParticleBurst trigger={level} color={KINGDOM.gold} />
      <BuildingTooltip buildingKey="palace" level={level} visible={hovered} position={[0, tooltipY, 0]} />

      {/* ╔══════════════════════════════════╗
          ║  TIER 1 — Royal Keep            ║
          ╚══════════════════════════════════╝
          A solid stone castle keep:
          wide rectangular body, 4 corner turrets,
          a central tower, grand entrance arch.       */}
      <TierGroup active={tier === 1}>
        {/* Stone platform */}
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[7, 0.36, 6]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>
        <Steps w={4} d={1} count={3} color={KINGDOM.stoneDark} />

        {/* Main hall body */}
        <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
          <boxGeometry args={[6.5, 4, 5.5]} />
          <meshStandardMaterial color={KINGDOM.stone} roughness={0.75} />
        </mesh>

        {/* Battlement parapet */}
        <mesh castShadow receiveShadow position={[0, 4.42, 0]}>
          <boxGeometry args={[6.8, 0.45, 5.8]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
        </mesh>
        {/* Merlons front & back */}
        {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
          <React.Fragment key={i}>
            <mesh castShadow position={[x, 5.0, 2.9]}>
              <boxGeometry args={[0.7, 0.65, 0.45]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
            </mesh>
            <mesh castShadow position={[x, 5.0, -2.9]}>
              <boxGeometry args={[0.7, 0.65, 0.45]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Arrow-slit windows */}
        {[-1.8, 0, 1.8].map((x, i) => (
          <mesh key={i} castShadow position={[x, 2.5, 2.76]}>
            <boxGeometry args={[0.3, 1.1, 0.1]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.4} />
          </mesh>
        ))}

        {/* Grand entrance arch frame */}
        <mesh castShadow position={[0, 1.6, 2.77]}>
          <boxGeometry args={[2.2, 3.0, 0.15]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.4, 2.78]}>
          <boxGeometry args={[1.5, 2.5, 0.1]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.9} />
        </mesh>

        {/* 4 corner turrets */}
        {[[-3, -2.8], [3, -2.8], [-3, 2.8], [3, 2.8]].map(([x, z], i) => (
          <Turret key={i} x={x} z={z} baseY={0.36} shaftH={5.5} shaftR={0.7} roofColor={KINGDOM.purpleDeep} />
        ))}

        {/* Central keep tower above main hall */}
        <mesh castShadow receiveShadow position={[0, 6.3, -0.5]}>
          <cylinderGeometry args={[1.1, 1.3, 3.5, 10]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 8.22, -0.5]}>
          <cylinderGeometry args={[1.22, 1.12, 0.45, 10]} />
          <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.7} />
        </mesh>
        {/* 8 merlons on keep */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 1.15, 8.7, -0.5 + Math.sin(a) * 1.15]}>
              <boxGeometry args={[0.35, 0.55, 0.35]} />
              <meshStandardMaterial color={KINGDOM.stoneDark} roughness={0.8} />
            </mesh>
          );
        })}
        <mesh castShadow position={[0, 9.9, -0.5]}>
          <coneGeometry args={[1.3, 3.0, 10]} />
          <meshStandardMaterial color={KINGDOM.purpleDeep} roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 11.5, -0.5]}>
          <cylinderGeometry args={[0.06, 0.16, 1.6, 8]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} />
        </mesh>
        <mesh castShadow position={[0, 12.35, -0.5]}>
          <sphereGeometry args={[0.25, 10, 10]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} emissive={KINGDOM.goldGlow} emissiveIntensity={0.4} />
        </mesh>

        {/* Banners */}
        <Banner x={-3} z={2.8} y={5.86} color={KINGDOM.crimson} />
        <Banner x={ 3} z={2.8} y={5.86} color={KINGDOM.crimson} />
      </TierGroup>

      {/* ╔══════════════════════════════════════╗
          ║  TIER 2 — Classical Royal Palace    ║
          ╚══════════════════════════════════════╝
          Wide marble palace, grand colonnade,
          3 golden domes, 4 flanking turrets,
          ornate front facade.                      */}
      <TierGroup active={tier === 2}>
        {/* Wide marble platform */}
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[11, 0.44, 9]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
        </mesh>
        <Steps w={6} d={1} count={4} color={KINGDOM.marbleDark} />

        {/* Left wing */}
        <mesh castShadow receiveShadow position={[-3.5, 2.5, 0]}>
          <boxGeometry args={[3.5, 4.5, 7]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
        </mesh>

        {/* Right wing */}
        <mesh castShadow receiveShadow position={[3.5, 2.5, 0]}>
          <boxGeometry args={[3.5, 4.5, 7]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.45} />
        </mesh>

        {/* Central hall (taller) */}
        <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
          <boxGeometry args={[4.8, 5.9, 7]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
        </mesh>

        {/* Gold trim between floors */}
        {[-5.2, 5.2].map((x, i) => (
          <mesh key={i} position={[x * 0, 4.7, 0]} />
        ))}
        <mesh position={[0, 4.75, 0]}>
          <boxGeometry args={[11.1, 0.14, 9.1]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.8} roughness={0.18} />
        </mesh>

        {/* Front colonnade — 5 columns */}
        {[-3.5, -1.75, 0, 1.75, 3.5].map((x, i) => (
          <Column key={i} x={x} z={3.62} h={4.0} r={0.32} baseY={0.44} />
        ))}

        {/* Front entablature */}
        <mesh castShadow receiveShadow position={[0, 5.08, 2.6]}>
          <boxGeometry args={[8.3, 0.55, 2.1]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
        {/* Gold trim on entablature */}
        <mesh position={[0, 5.37, 2.6]}>
          <boxGeometry args={[8.3, 0.1, 2.1]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.82} roughness={0.18} />
        </mesh>

        {/* Windows on wings */}
        {[-3.5, 3.5].map((x, i) =>
          [-1.5, 0, 1.5].map((z, j) => (
            <mesh key={`${i}-${j}`} castShadow position={[x, 2.8, z]}>
              <boxGeometry args={[0.08, 1.2, 0.85]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.35} />
            </mesh>
          ))
        )}

        {/* Gate entrance */}
        <mesh castShadow position={[0, 2.2, 3.52]}>
          <boxGeometry args={[2.6, 4.0, 0.18]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, 2.0, 3.53]}>
          <boxGeometry args={[1.8, 3.2, 0.1]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 3 golden domes — centre larger */}
        <Dome y={7.18} r={1.8} color={KINGDOM.gold} spireH={2.2} drumH={0.7} />
        <group position={[-2.8, 0, 0]}>
          <Dome y={5.38} r={1.1} color={KINGDOM.goldDeep} spireH={1.4} drumH={0.5} />
        </group>
        <group position={[2.8, 0, 0]}>
          <Dome y={5.38} r={1.1} color={KINGDOM.goldDeep} spireH={1.4} drumH={0.5} />
        </group>

        {/* 4 corner turrets */}
        {[[-5.2, -4.0], [5.2, -4.0], [-5.2, 4.0], [5.2, 4.0]].map(([x, z], i) => (
          <Turret key={i} x={x} z={z} baseY={0.44} shaftH={5.8} shaftR={0.85}
            roofColor={KINGDOM.purpleDeep} gold={false} />
        ))}

        {/* Banners on turrets */}
        {[[-5.2, 4.0], [5.2, 4.0]].map(([x, z], i) => (
          <Banner key={i} x={x} z={z} y={6.26} color={KINGDOM.crimson} />
        ))}
      </TierGroup>

      {/* ╔════════════════════════════════════════════╗
          ║  TIER 3 — Grand Imperial Palace           ║
          ╚════════════════════════════════════════════╝
          Sprawling imperial complex:
          wide platform, grand colonnade, two side
          wings, huge central dome on drum, 4 tall
          flanking minarets, ornate gold trim everywhere,
          rotating crown & light beam.                 */}
      <TierGroup active={tier === 3}>
        {/* Grand raised platform — 5 steps */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[16, 0.5, 13]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.62} />
        </mesh>
        <Steps w={8} d={1} count={5} color={KINGDOM.marbleDark} />
        {/* Gold edge on platform */}
        {[-8, 8].map((x, i) => (
          <mesh key={i} position={[x, 0.52, 0]}>
            <boxGeometry args={[0.18, 0.1, 13]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
        <mesh position={[0, 0.52, 6.5]}>
          <boxGeometry args={[16, 0.1, 0.18]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.52, -6.5]}>
          <boxGeometry args={[16, 0.1, 0.18]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* ── LEFT WING ── */}
        <mesh castShadow receiveShadow position={[-5.2, 3.5, 0]}>
          <boxGeometry args={[4.8, 6.5, 9.5]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
        </mesh>
        {/* Left wing dome */}
        <group position={[-5.2, 0, 0]}>
          <Dome y={7.25} r={1.5} color={KINGDOM.goldDeep} spireH={1.6} drumH={0.9} />
        </group>

        {/* ── RIGHT WING ── */}
        <mesh castShadow receiveShadow position={[5.2, 3.5, 0]}>
          <boxGeometry args={[4.8, 6.5, 9.5]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.42} />
        </mesh>
        <group position={[5.2, 0, 0]}>
          <Dome y={7.25} r={1.5} color={KINGDOM.goldDeep} spireH={1.6} drumH={0.9} />
        </group>

        {/* ── CENTRAL HALL (grand, taller) ── */}
        <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
          <boxGeometry args={[7.5, 8.5, 9.5]} />
          <meshStandardMaterial color={KINGDOM.marble} roughness={0.38} />
        </mesh>

        {/* Horizontal gold belt around everything */}
        <mesh position={[0, 6.3, 0]}>
          <boxGeometry args={[16.1, 0.18, 13.1]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.82} roughness={0.18} />
        </mesh>

        {/* Windows on wings */}
        {[-5.2, 5.2].map((x, wi) =>
          [-2.8, 0, 2.8].map((z, j) => (
            <mesh key={`w${wi}${j}`} castShadow position={[x, 4.0, z]}>
              <boxGeometry args={[0.1, 1.8, 1.2]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.45} />
            </mesh>
          ))
        )}
        {/* Central hall windows */}
        {[-2.2, 0, 2.2].map((z, j) => (
          <mesh key={`cw${j}`} castShadow position={[3.76, 4.5, z]}>
            <boxGeometry args={[0.1, 2.2, 1.4]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} />
          </mesh>
        ))}
        {[-2.2, 0, 2.2].map((z, j) => (
          <mesh key={`cwr${j}`} castShadow position={[-3.76, 4.5, z]}>
            <boxGeometry args={[0.1, 2.2, 1.4]} />
            <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* ── GRAND FRONT COLONNADE (8 columns) ── */}
        {[-5.25, -3.75, -2.25, -0.75, 0.75, 2.25, 3.75, 5.25].map((x, i) => (
          <Column key={i} x={x} z={4.82} h={6.2} r={0.42} baseY={0.5} />
        ))}

        {/* Grand entablature */}
        <mesh castShadow receiveShadow position={[0, 7.45, 3.2]}>
          <boxGeometry args={[12, 0.7, 3.2]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
        <mesh position={[0, 7.82, 3.2]}>
          <boxGeometry args={[12, 0.14, 3.2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Grand arched entrance */}
        <mesh castShadow position={[0, 3.6, 4.76]}>
          <boxGeometry args={[3.4, 6.8, 0.22]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 3.4, 4.77]}>
          <boxGeometry args={[2.4, 5.8, 0.12]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.72} roughness={0.28} />
        </mesh>
        {/* Gold door trim lines */}
        <mesh position={[-1.2, 3.4, 4.84]}>
          <boxGeometry args={[0.14, 5.8, 0.1]} />
          <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[1.2, 3.4, 4.84]}>
          <boxGeometry args={[0.14, 5.8, 0.1]} />
          <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.8} />
        </mesh>

        {/* ── GRAND CENTRAL DOME (massive, golden) ── */}
        {/* Drum */}
        <mesh castShadow receiveShadow position={[0, 9.5, -0.5]}>
          <cylinderGeometry args={[2.9, 3.0, 2.2, 20]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.45} />
        </mesh>
        {/* Drum windows */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a) * 2.96, 10.5, -0.5 + Math.sin(a) * 2.96]}>
              <boxGeometry args={[0.45, 1.0, 0.1]} />
              <meshStandardMaterial color={KINGDOM.crystalGlow} emissive={KINGDOM.crystalGlow} emissiveIntensity={0.6} />
            </mesh>
          );
        })}
        {/* Gold band on drum top */}
        <mesh position={[0, 10.62, -0.5]}>
          <torusGeometry args={[3.02, 0.18, 8, 36]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.88} roughness={0.12} />
        </mesh>
        {/* The dome itself */}
        <mesh castShadow receiveShadow position={[0, 10.7, -0.5]}>
          <sphereGeometry args={[3.0, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.94} roughness={0.06} />
        </mesh>
        {/* Lantern on dome */}
        <mesh castShadow receiveShadow position={[0, 13.8, -0.5]}>
          <cylinderGeometry args={[0.55, 0.7, 1.1, 12]} />
          <meshStandardMaterial color={KINGDOM.marbleDark} roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 14.4, -0.5]}>
          <sphereGeometry args={[0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.92} roughness={0.08} />
        </mesh>
        {/* Tall spire */}
        <mesh castShadow position={[0, 15.3, -0.5]}>
          <cylinderGeometry args={[0.07, 0.22, 3.8, 10]} />
          <meshStandardMaterial color={KINGDOM.goldDark} metalness={0.92} />
        </mesh>
        <mesh castShadow position={[0, 17.22, -0.5]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color={KINGDOM.gold} metalness={0.97} roughness={0.03}
            emissive={KINGDOM.goldGlow} emissiveIntensity={0.55} />
        </mesh>

        {/* ── 4 FLANKING MINARETS ── */}
        {[[-7.2, -4.5], [7.2, -4.5], [-7.2, 4.5], [7.2, 4.5]].map(([x, z], i) => (
          <Turret key={i} x={x} z={z} baseY={0.5} shaftH={9.5} shaftR={1.05} gold />
        ))}

        {/* ── REAR SMALLER DOMES (2) ── */}
        <group position={[-2.5, 0, -3.0]}>
          <Dome y={9.5} r={1.0} color={KINGDOM.goldDeep} spireH={1.2} drumH={0.6} />
        </group>
        <group position={[2.5, 0, -3.0]}>
          <Dome y={9.5} r={1.0} color={KINGDOM.goldDeep} spireH={1.2} drumH={0.6} />
        </group>

        {/* ── BANNERS ── */}
        {[[-7.2, 4.5], [7.2, 4.5], [-5.2, 4.8], [5.2, 4.8]].map(([x, z], i) => (
          <Banner key={i} x={x} z={z} y={10.0} color={i % 2 === 0 ? KINGDOM.crimson : KINGDOM.royalRed} />
        ))}

        {/* ── ROTATING CROWN RING ── */}
        <mesh ref={crownRef} position={[0, 17.6, -0.5]}>
          <torusGeometry args={[1.8, 0.12, 8, 36]} />
          <meshStandardMaterial color={KINGDOM.goldGlow} emissive={KINGDOM.goldGlow} emissiveIntensity={0.7}
            metalness={0.8} roughness={0.15} />
        </mesh>

        {/* ── LIGHT BEAM from dome ── */}
        <mesh position={[0, 22, -0.5]}>
          <cylinderGeometry args={[0.3, 2.5, 10, 18]} />
          <meshBasicMaterial color={KINGDOM.goldGlow} transparent opacity={0.12}
            blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ── FLOATING CROWN ABOVE ── */}
        <Floating height={0.5} speed={1.2} yOffset={23}>
          <mesh ref={haloRef}>
            <torusGeometry args={[1.2, 0.18, 10, 40]} />
            <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05}
              emissive={KINGDOM.goldGlow} emissiveIntensity={0.6} />
          </mesh>
          {/* Crown points */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} castShadow position={[Math.cos(a) * 1.2, 0.3, Math.sin(a) * 1.2]}>
                <coneGeometry args={[0.12, 0.55, 6]} />
                <meshStandardMaterial color={KINGDOM.gold} metalness={0.95} roughness={0.05}
                  emissive={KINGDOM.goldGlow} emissiveIntensity={0.4} />
              </mesh>
            );
          })}
        </Floating>
      </TierGroup>
    </group>
  );
}
