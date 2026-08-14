import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NAMAA } from './palette';

interface CharacterProps {
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  skinColor?: string;
  scale?: number;
  hasHat?: boolean;
  hatColor?: string;
  holdingItem?: 'spear' | 'basket' | 'none';
}

/** Low-Poly Stylized Humanoid Rig */
function CharacterModel({
  shirtColor = '#8B84D7',
  pantsColor = '#0C2341',
  hairColor = '#4A2E1B',
  skinColor = '#FAD0B1',
  hasHat = false,
  hatColor = '#C66E4E',
  holdingItem = 'none',
  isWalking = false,
  walkPhase = 0,
  isWaving = false,
}: CharacterProps & {
  isWalking?: boolean;
  walkPhase?: number;
  isWaving?: boolean;
}) {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 6 + walkPhase;

    if (isWalking) {
      const swing = Math.sin(t) * 0.55;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.9;
      if (rightArmRef.current && !isWaving) rightArmRef.current.rotation.x = swing * 0.9;
    } else {
      // Idle breathing / slight sway
      const idle = Math.sin(clock.getElapsedTime() * 2 + walkPhase) * 0.05;
      if (leftArmRef.current) leftArmRef.current.rotation.z = 0.1 + idle;
      if (rightArmRef.current && !isWaving) rightArmRef.current.rotation.z = -0.1 - idle;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }

    if (isWaving && rightArmRef.current) {
      rightArmRef.current.rotation.x = -Math.PI * 0.8;
      rightArmRef.current.rotation.z = -0.4 + Math.sin(clock.getElapsedTime() * 8) * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Pelvis / Hips */}
      <mesh castShadow position={[0, 0.48, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.18]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>

      {/* 2. Torso / Shirt */}
      <mesh castShadow position={[0, 0.68, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* 3. Head and Hair */}
      <group ref={headRef} position={[0, 0.94, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hair */}
        <mesh castShadow position={[0, 0.05, -0.02]}>
          <sphereGeometry args={[0.14, 7, 7]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Optional Hat */}
        {hasHat && (
          <group position={[0, 0.1, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.18, 0.18, 8]} />
              <meshStandardMaterial color={hatColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 12]} />
              <meshStandardMaterial color={hatColor} roughness={0.7} />
            </mesh>
          </group>
        )}
      </group>

      {/* 4. Left Leg */}
      <group ref={leftLegRef} position={[-0.08, 0.44, 0]}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.11, 0.08, 0.16]} />
          <meshStandardMaterial color="#2B1A0E" roughness={0.9} />
        </mesh>
      </group>

      {/* 5. Right Leg */}
      <group ref={rightLegRef} position={[0.08, 0.44, 0]}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.11, 0.08, 0.16]} />
          <meshStandardMaterial color="#2B1A0E" roughness={0.9} />
        </mesh>
      </group>

      {/* 6. Left Arm */}
      <group ref={leftArmRef} position={[-0.2, 0.78, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.32, 0.09]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 7. Right Arm */}
      <group ref={rightArmRef} position={[0.2, 0.78, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.32, 0.09]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Optional Spear for Guards */}
        {holdingItem === 'spear' && (
          <group position={[0.02, 0.1, 0.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
              <meshStandardMaterial color="#5C381E" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[0, 0.85, 0]}>
              <coneGeometry args={[0.06, 0.22, 6]} />
              <meshStandardMaterial color={NAMAA.gold} roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* Optional Basket for Farmers/Shoppers */}
        {holdingItem === 'basket' && (
          <mesh castShadow position={[0, -0.35, 0.15]}>
            <cylinderGeometry args={[0.12, 0.09, 0.14, 8]} />
            <meshStandardMaterial color="#8B5E3C" roughness={0.9} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Path Walking Villager (moves along waypoints continuously) */
function PathWalker({
  waypoints,
  speed = 1.2,
  shirtColor = '#8B84D7',
  pantsColor = '#0C2341',
  hairColor = '#4A2E1B',
  hasHat = false,
  hatColor = '#C66E4E',
  holdingItem = 'none',
  scale = 0.9,
  startOffset = 0,
}: {
  waypoints: [number, number][];
  speed?: number;
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  hasHat?: boolean;
  hatColor?: string;
  holdingItem?: 'spear' | 'basket' | 'none';
  scale?: number;
  startOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Compute total path length
  const { totalLength, segmentLengths } = useMemo(() => {
    let total = 0;
    const segs: number[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const [x1, z1] = waypoints[i];
      const [x2, z2] = waypoints[i + 1];
      const d = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      segs.push(d);
      total += d;
    }
    return { totalLength: total, segmentLengths: segs };
  }, [waypoints]);

  useFrame(({ clock }) => {
    if (!groupRef.current || totalLength === 0) return;
    const t = clock.getElapsedTime() * speed + startOffset;

    // Ping-pong along path
    const cycle = (t % (totalLength * 2));
    const dist = cycle < totalLength ? cycle : totalLength * 2 - cycle;
    const isForward = cycle < totalLength;

    // Find current segment
    let accum = 0;
    let currSeg = 0;
    let segT = 0;

    for (let i = 0; i < segmentLengths.length; i++) {
      if (dist <= accum + segmentLengths[i]) {
        currSeg = i;
        segT = (dist - accum) / segmentLengths[i];
        break;
      }
      accum += segmentLengths[i];
    }

    const p1 = waypoints[currSeg];
    const p2 = waypoints[currSeg + 1] || waypoints[currSeg];

    const currentX = p1[0] + (p2[0] - p1[0]) * segT;
    const currentZ = p1[1] + (p2[1] - p1[1]) * segT;

    const dirX = isForward ? p2[0] - p1[0] : p1[0] - p2[0];
    const dirZ = isForward ? p2[1] - p1[1] : p1[1] - p2[1];
    const angle = Math.atan2(dirX, dirZ);

    groupRef.current.position.set(currentX, 0, currentZ);
    groupRef.current.rotation.y = angle;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <CharacterModel
        shirtColor={shirtColor}
        pantsColor={pantsColor}
        hairColor={hairColor}
        hasHat={hasHat}
        hatColor={hatColor}
        holdingItem={holdingItem}
        isWalking={true}
        walkPhase={startOffset * 5}
      />
    </group>
  );
}

/** Static / Local Active Villager (waving, chatting, guarding) */
function StationaryVillager({
  position,
  rotation = 0,
  shirtColor,
  pantsColor,
  hairColor,
  hasHat,
  hatColor,
  holdingItem = 'none',
  isWaving = false,
  scale = 0.9,
}: {
  position: [number, number, number];
  rotation?: number;
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  hasHat?: boolean;
  hatColor?: string;
  holdingItem?: 'spear' | 'basket' | 'none';
  isWaving?: boolean;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <CharacterModel
        shirtColor={shirtColor}
        pantsColor={pantsColor}
        hairColor={hairColor}
        hasHat={hasHat}
        hatColor={hatColor}
        holdingItem={holdingItem}
        isWalking={false}
        isWaving={isWaving}
      />
    </group>
  );
}

export function Villagers() {
  // Path 1: Main Gate to Central Plaza
  const avenuePath: [number, number][] = [
    [16.5, 0.4], [12.0, 0.4], [8.0, 0.3], [4.5, 0.2]
  ];

  // Path 2: Central Plaza to Market
  const marketPath: [number, number][] = [
    [3.2, 3.2], [4.8, 4.8], [6.5, 6.5], [7.8, 7.8]
  ];

  // Path 3: Central Plaza to Farm
  const farmPath: [number, number][] = [
    [3.2, -3.2], [4.8, -4.8], [6.5, -6.5], [7.8, -7.8]
  ];

  // Path 4: Central Plaza to Bank
  const bankPath: [number, number][] = [
    [-3.2, -3.2], [-4.8, -4.8], [-6.5, -6.5], [-7.8, -7.8]
  ];

  // Path 5: Central Plaza to Windmill
  const windmillPath: [number, number][] = [
    [-3.2, 3.2], [-4.8, 4.8], [-6.5, 6.5], [-7.8, 7.8]
  ];

  // Path 6: Circular North Promenade
  const northRingPath: [number, number][] = [
    [-6.5, -7.2], [-3.5, -9.5], [0, -10.5], [3.5, -9.5], [6.5, -7.2]
  ];

  // Path 7: Circular South Promenade
  const southRingPath: [number, number][] = [
    [-6.5, 7.2], [-3.5, 9.5], [0, 10.5], [3.5, 9.5], [6.5, 7.2]
  ];

  return (
    <group name="village-animated-citizens">
      {/* 1. Royal City Guards at the Gate (+X) */}
      <StationaryVillager
        position={[17.2, 0, 1.6]}
        rotation={-Math.PI / 2}
        shirtColor="#0C2341"
        pantsColor="#1F2E45"
        holdingItem="spear"
        hasHat={true}
        hatColor="#C66E4E"
        scale={0.95}
      />
      <StationaryVillager
        position={[17.2, 0, -1.6]}
        rotation={-Math.PI / 2}
        shirtColor="#0C2341"
        pantsColor="#1F2E45"
        holdingItem="spear"
        hasHat={true}
        hatColor="#C66E4E"
        scale={0.95}
      />

      {/* 2. Kid waving near Central Palace Plaza */}
      <StationaryVillager
        position={[2.5, 0, 1.2]}
        rotation={-Math.PI * 0.7}
        shirtColor="#C66E4E"
        pantsColor="#8B84D7"
        hairColor="#E6A15C"
        isWaving={true}
        scale={0.8}
      />

      {/* 3. Farmer in the Fields */}
      <StationaryVillager
        position={[6.8, 0, -7.5]}
        rotation={Math.PI / 4}
        shirtColor="#2D6A4F"
        pantsColor="#523B27"
        hasHat={true}
        hatColor="#D4A373"
        holdingItem="basket"
        scale={0.88}
      />

      {/* 4. Merchant in the Market */}
      <StationaryVillager
        position={[7.5, 0, 6.8]}
        rotation={-Math.PI / 3}
        shirtColor="#F59E0B"
        pantsColor="#78350F"
        hasHat={true}
        hatColor="#9B5DE5"
        isWaving={true}
        scale={0.88}
      />

      {/* 5. Walking Citizens on Main Avenues */}
      {/* Citizen walking from Gate to Plaza */}
      <PathWalker
        waypoints={avenuePath}
        speed={1.4}
        shirtColor="#8B84D7"
        pantsColor="#0C2341"
        startOffset={0}
      />
      {/* Citizen with basket returning from Market */}
      <PathWalker
        waypoints={marketPath}
        speed={1.2}
        shirtColor="#E76F51"
        pantsColor="#264653"
        holdingItem="basket"
        startOffset={2.5}
      />
      {/* Citizen walking to Farm */}
      <PathWalker
        waypoints={farmPath}
        speed={1.3}
        shirtColor="#3A86FF"
        pantsColor="#14213D"
        startOffset={1.2}
      />
      {/* Citizen walking to Bank */}
      <PathWalker
        waypoints={bankPath}
        speed={1.1}
        shirtColor="#059669"
        pantsColor="#064E3B"
        hasHat={true}
        hatColor="#D97706"
        startOffset={3.8}
      />
      {/* Citizen walking to Windmill */}
      <PathWalker
        waypoints={windmillPath}
        speed={1.3}
        shirtColor="#9B5DE5"
        pantsColor="#3C096C"
        startOffset={1.7}
      />
      {/* Citizen strolling on North promenade */}
      <PathWalker
        waypoints={northRingPath}
        speed={1.0}
        shirtColor="#F4A261"
        pantsColor="#2B2D42"
        startOffset={0.5}
      />
      {/* Citizen strolling on South promenade */}
      <PathWalker
        waypoints={southRingPath}
        speed={1.0}
        shirtColor="#2A9D8F"
        pantsColor="#1D3557"
        startOffset={3.0}
      />
    </group>
  );
}
