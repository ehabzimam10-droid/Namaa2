import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, useHoverLift } from './utils';
import { BuildingTooltip } from './BuildingTooltip';

/* ─── helpers ─── */

/**
 * One windmill blade:
 *  - main wooden spar (arm going upward from hub)
 *  - cross spar for structure
 *  - sail panels stretched between the arms
 */
function Blade({
  len,
  sailW,
  sparColor,
  sailColor,
  sailOpacity = 0.92,
}: {
  len: number;
  sailW: number;
  sparColor: string;
  sailColor: string;
  sailOpacity?: number;
}) {
  const sparH = 0.1;
  const sparD = 0.07;
  const slats = Math.max(3, Math.floor(len / 0.55));
  const sailStart = 0.22; // sail starts after hub area

  return (
    <group>
      {/* Main spar */}
      <mesh castShadow position={[0, len / 2 + 0.08, 0]}>
        <boxGeometry args={[sparH, len, sparD]} />
        <meshStandardMaterial color={sparColor} roughness={0.92} />
      </mesh>
      {/* Leading edge spar (offset in X) */}
      <mesh castShadow position={[sailW * 0.38, len * 0.55 + 0.08, 0]}>
        <boxGeometry args={[sparH * 0.8, len * 0.72, sparD * 0.8]} />
        <meshStandardMaterial color={sparColor} roughness={0.92} />
      </mesh>
      {/* Cross member near tip */}
      <mesh castShadow position={[sailW * 0.19, len * 0.88, 0]}>
        <boxGeometry args={[sailW * 0.8, sparH, sparD]} />
        <meshStandardMaterial color={sparColor} roughness={0.92} />
      </mesh>
      {/* Cross member near base */}
      <mesh castShadow position={[sailW * 0.19, len * 0.25 + 0.08, 0]}>
        <boxGeometry args={[sailW * 0.8, sparH, sparD]} />
        <meshStandardMaterial color={sparColor} roughness={0.92} />
      </mesh>
      {/* Sail slats */}
      {Array.from({ length: slats }, (_, i) => {
        const t = sailStart + (i + 0.5) * ((1 - sailStart) / slats);
        return (
          <mesh key={i} castShadow position={[sailW * 0.19, t * len + 0.08, 0.02]}>
            <boxGeometry args={[sailW * 0.75, (len * (1 - sailStart)) / slats * 0.88, 0.05]} />
            <meshStandardMaterial
              color={sailColor}
              roughness={0.72}
              transparent
              opacity={sailOpacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** 4-blade rotor mounted on the front face of the tower */
function Rotor({
  bladeLen,
  sailW,
  sparColor,
  sailColor,
  sailOpacity,
  groupRef,
}: {
  bladeLen: number;
  sailW: number;
  sparColor: string;
  sailColor: string;
  sailOpacity?: number;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={groupRef}>
      {/* Hub disc */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 10]} />
        <meshStandardMaterial color={sparColor} roughness={0.85} />
      </mesh>
      {/* 4 blades at 0°, 90°, 180°, 270° */}
      {[0, 1, 2, 3].map(i => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
          <Blade
            len={bladeLen}
            sailW={sailW}
            sparColor={sparColor}
            sailColor={sailColor}
            sailOpacity={sailOpacity}
          />
        </group>
      ))}
    </group>
  );
}

/** Simple door on the front of a tower */
function TowerDoor({ h, z, w = 0.44 }: { h: number; z: number; w?: number }) {
  return (
    <group position={[0, h * 0.28, z + 0.01]}>
      {/* Door frame */}
      <mesh castShadow>
        <boxGeometry args={[w + 0.1, h * 0.56 + 0.1, 0.08]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.88} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[w, h * 0.56, 0.07]} />
        <meshStandardMaterial color={NAMAA.wood} roughness={0.85} />
      </mesh>
      {/* Arched top */}
      <mesh position={[0, h * 0.28, 0.05]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <torusGeometry args={[w / 2, 0.055, 7, 14, Math.PI]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.88} />
      </mesh>
    </group>
  );
}

/** Small round window */
function TowerWindow({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#aad4f5" transparent opacity={0.7} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 1 — طاحونة خشبية بسيطة
   جسم خشبي مخروطي + باب + 4 ريشات قماشية
   ════════════════════════════════════════════ */
function SimpleWindmill({ rotorRef }: { rotorRef: React.RefObject<THREE.Group | null> }) {
  const tH = 3.8;
  const tR  = 0.72; // tower top radius

  return (
    <group>
      {/* Tower — tapered octagonal wood body */}
      <mesh castShadow receiveShadow position={[0, tH / 2, 0]}>
        <cylinderGeometry args={[tR, tR * 1.28, tH, 8]} />
        <meshStandardMaterial color={NAMAA.wood} roughness={0.9} />
      </mesh>
      {/* Horizontal planks (decorative bands) */}
      {[0.8, 1.8, 2.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[tR * 1.01 + 0.04, tR * 1.28 * (1 - y / tH) * 1.01 + 0.04, 0.12, 8]} />
          <meshStandardMaterial color={NAMAA.woodDark} roughness={0.92} />
        </mesh>
      ))}
      {/* Conical cap */}
      <mesh castShadow position={[0, tH + 0.55, 0]}>
        <coneGeometry args={[tR + 0.08, 1.1, 8]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.88} />
      </mesh>
      {/* Door */}
      <TowerDoor h={tH} z={tR * 1.28} />
      {/* Shaft stub */}
      <mesh castShadow position={[0, tH - 0.5, tR + 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.9} />
      </mesh>
      {/* Rotor */}
      <group position={[0, tH - 0.5, tR + 0.28]}>
        <Rotor
          bladeLen={1.7}
          sailW={0.52}
          sparColor={NAMAA.woodDark}
          sailColor="#f5f0e0"
          groupRef={rotorRef}
        />
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 2 — طاحونة حجرية
   برج حجري أسطواني + شبابيك + ريشات بإطار خشبي
   ════════════════════════════════════════════ */
function StoneWindmill({ rotorRef }: { rotorRef: React.RefObject<THREE.Group | null> }) {
  const tH = 5.5;
  const tR  = 0.88;

  return (
    <group>
      {/* Stone tower */}
      <mesh castShadow receiveShadow position={[0, tH / 2, 0]}>
        <cylinderGeometry args={[tR, tR * 1.18, tH, 12]} />
        <meshStandardMaterial color={NAMAA.stone} roughness={0.84} />
      </mesh>
      {/* Stone band rings */}
      {[1.1, 2.4, 3.7, 4.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[tR * 1.04 + 0.04, tR * 1.18 * (1 - y / tH) * 1.04 + 0.04, 0.16, 12]} />
          <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.88} />
        </mesh>
      ))}
      {/* Conical cap (terracotta) */}
      <mesh castShadow position={[0, tH + 0.6, 0]}>
        <coneGeometry args={[tR + 0.12, 1.3, 12]} />
        <meshStandardMaterial color={NAMAA.copper} roughness={0.82} />
      </mesh>
      {/* Cap tip */}
      <mesh position={[0, tH + 1.3, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={NAMAA.copperDeep} roughness={0.75} />
      </mesh>
      {/* Door */}
      <TowerDoor h={tH} z={tR * 1.18} w={0.5} />
      {/* Windows */}
      <TowerWindow x={0} y={tH * 0.55} z={tR * 1.0 + 0.04} />
      <TowerWindow x={0} y={tH * 0.78} z={tR * 0.95 + 0.04} />
      {/* Shaft */}
      <mesh castShadow position={[0, tH - 0.65, tR + 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.4, 8]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.88} />
      </mesh>
      {/* Rotor */}
      <group position={[0, tH - 0.65, tR + 0.38]}>
        <Rotor
          bladeLen={2.4}
          sailW={0.72}
          sparColor={NAMAA.woodDark}
          sailColor="#e8dfc0"
          groupRef={rotorRef}
        />
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════
   TIER 3 — طاحونة الأسياد
   برج حجري ضخم + قبة ذهبية + شُرفة + ريشات فاخرة
   ════════════════════════════════════════════ */
function GrandWindmill({ rotorRef }: { rotorRef: React.RefObject<THREE.Group | null> }) {
  const tH = 7.2;
  const tR  = 1.05;

  return (
    <group>
      {/* Stone tower */}
      <mesh castShadow receiveShadow position={[0, tH / 2, 0]}>
        <cylinderGeometry args={[tR, tR * 1.22, tH, 14]} />
        <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.82} />
      </mesh>
      {/* Decorative stone bands */}
      {[1.3, 2.8, 4.3, 5.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[tR * 1.06 + 0.04, tR * 1.22 * (1 - y / tH) * 1.06 + 0.04, 0.2, 14]} />
          <meshStandardMaterial color={NAMAA.stone} roughness={0.85} />
        </mesh>
      ))}
      {/* Gallery / balcony ring */}
      <mesh castShadow position={[0, tH - 0.5, 0]}>
        <cylinderGeometry args={[tR + 0.44, tR + 0.44, 0.22, 14]} />
        <meshStandardMaterial color={NAMAA.stone} roughness={0.84} />
      </mesh>
      {/* Balcony railing posts */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * (tR + 0.44), tH - 0.16, Math.sin(a) * (tR + 0.44)]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
            <meshStandardMaterial color={NAMAA.stoneDark} roughness={0.85} />
          </mesh>
        );
      })}
      <mesh castShadow position={[0, tH - 0.02 + 0.25, 0]}>
        <cylinderGeometry args={[tR + 0.44, tR + 0.44, 0.07, 14]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Gold dome cap */}
      <mesh castShadow position={[0, tH + 0.06, 0]}>
        <cylinderGeometry args={[tR - 0.02, tR - 0.02, 0.22, 14]} />
        <meshStandardMaterial color={NAMAA.white} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, tH + 0.76, 0]}>
        <sphereGeometry args={[tR, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.7} roughness={0.26} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, tH + 1.56, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.8, 7]} />
        <meshStandardMaterial color={NAMAA.gold} metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, tH + 1.98, 0]}>
        <sphereGeometry args={[0.12, 9, 9]} />
        <meshStandardMaterial color={NAMAA.goldLight} metalness={0.88} roughness={0.14} />
      </mesh>

      {/* Door */}
      <TowerDoor h={tH} z={tR * 1.22} w={0.55} />
      {/* Windows */}
      <TowerWindow x={0} y={tH * 0.42} z={tR * 1.04 + 0.04} />
      <TowerWindow x={0} y={tH * 0.6}  z={tR * 0.99 + 0.04} />
      <TowerWindow x={0} y={tH * 0.77} z={tR * 0.95 + 0.04} />

      {/* Shaft */}
      <mesh castShadow position={[0, tH - 0.85, tR + 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.48, 8]} />
        <meshStandardMaterial color={NAMAA.woodDark} roughness={0.86} />
      </mesh>
      {/* Rotor */}
      <group position={[0, tH - 0.85, tR + 0.46]}>
        <Rotor
          bladeLen={3.1}
          sailW={0.9}
          sparColor={NAMAA.woodDark}
          sailColor={NAMAA.purple}
          sailOpacity={0.88}
          groupRef={rotorRef}
        />
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════ */
export function Windmill({
  tier,
  level,
  position,
}: {
  tier: Tier;
  level: number;
  position: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const liftRef  = useHoverLift(hovered);

  const rotor1 = useRef<THREE.Group>(null);
  const rotor2 = useRef<THREE.Group>(null);
  const rotor3 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const base = 0.6 + level * 0.18;
    if (rotor1.current) rotor1.current.rotation.z -= base * delta;
    if (rotor2.current) rotor2.current.rotation.z -= base * delta;
    if (rotor3.current) rotor3.current.rotation.z -= base * delta;
  });

  return (
    <group
      position={position}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={liftRef}>
        <BuildingTooltip bKey="windmill" level={level} tier={tier} visible={hovered} />
        <ParticleBurst trigger={level} color={NAMAA.purpleBright} />

        <TierGroup active={tier === 1}><SimpleWindmill  rotorRef={rotor1} /></TierGroup>
        <TierGroup active={tier === 2}><StoneWindmill   rotorRef={rotor2} /></TierGroup>
        <TierGroup active={tier === 3}><GrandWindmill   rotorRef={rotor3} /></TierGroup>
      </group>
    </group>
  );
}
