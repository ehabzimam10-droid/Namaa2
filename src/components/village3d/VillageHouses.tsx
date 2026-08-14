import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NAMAA } from './palette';

/** Animated chimney smoke puffs */
function ChimneySmoke({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const puffs = useRef(
    Array.from({ length: 5 }, (_, i) => ({
      offset: i * 0.7,
      speed: 0.6 + Math.random() * 0.3,
      driftX: (Math.random() - 0.5) * 0.2,
      driftZ: (Math.random() - 0.5) * 0.2,
    }))
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = puffs.current[i];
      const life = ((t * p.speed + p.offset) % 3.5) / 3.5; // 0 to 1
      const y = life * 1.8;
      const scale = 0.12 + life * 0.25;
      const x = Math.sin(t * 1.5 + i) * 0.15 + p.driftX * life * 2;
      const z = Math.cos(t * 1.2 + i) * 0.15 + p.driftZ * life * 2;

      child.position.set(x, y, z);
      child.scale.setScalar(scale);
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.max(0, (1 - life) * 0.55);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {puffs.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 7, 7]} />
          <meshStandardMaterial
            color="#EAEFF5"
            transparent
            opacity={0.4}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** House Type A: Traditional Half-Timbered Gable House */
export function TimberCottage({
  position,
  rotation = [0, 0, 0],
  roofColor = '#B24C34',
  wallColor = '#FAF5E8',
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  roofColor?: string;
  wallColor?: string;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Foundation Base */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[2.4, 0.5, 2.0]} />
        <meshStandardMaterial color="#6E7987" roughness={0.9} />
      </mesh>

      {/* Main Ground Floor Walls */}
      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[2.2, 0.9, 1.8]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Upper Floor (Slight overhang for classic medieval look) */}
      <mesh castShadow receiveShadow position={[0, 1.7, 0]}>
        <boxGeometry args={[2.3, 0.7, 1.9]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Vertical & Horizontal Timber Beams */}
      {/* Corner beams */}
      {[-1.05, 1.05].map((x) =>
        [-0.85, 0.85].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 1.35, z]}>
            <boxGeometry args={[0.1, 1.6, 0.1]} />
            <meshStandardMaterial color="#5C381E" roughness={0.85} />
          </mesh>
        ))
      )}
      {/* Mid-level horizontal beam */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[2.32, 0.08, 1.92]} />
        <meshStandardMaterial color="#5C381E" roughness={0.85} />
      </mesh>

      {/* Pitched Roof */}
      <mesh castShadow receiveShadow position={[0, 2.45, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.7, 1.2, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} />
      </mesh>
      {/* Overhang eaves */}
      <mesh castShadow position={[0, 2.05, 0]}>
        <boxGeometry args={[2.5, 0.08, 2.1]} />
        <meshStandardMaterial color="#4A2D18" roughness={0.85} />
      </mesh>

      {/* Stone Chimney */}
      <group position={[0.7, 2.3, 0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 1.1, 0.4]} />
          <meshStandardMaterial color="#5E6773" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[0.46, 0.1, 0.46]} />
          <meshStandardMaterial color="#3E444D" roughness={0.9} />
        </mesh>
        <ChimneySmoke position={[0, 0.7, 0]} />
      </group>

      {/* Front Wooden Door */}
      <group position={[0, 0.7, 0.92]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.8, 0.06]} />
          <meshStandardMaterial color="#6B3F21" roughness={0.7} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.16, 0, 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={NAMAA.gold} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Stone Step */}
        <mesh receiveShadow position={[0, -0.42, 0.1]}>
          <boxGeometry args={[0.7, 0.1, 0.25]} />
          <meshStandardMaterial color="#8A96A6" roughness={0.9} />
        </mesh>
      </group>

      {/* Windows with Warm Yellow Glow */}
      {/* Front Window */}
      <group position={[-0.55, 1.0, 0.92]}>
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.04]} />
          <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.44, 0.44, 0.02]} />
          <meshStandardMaterial color="#4A2D18" roughness={0.8} />
        </mesh>
      </group>
      {/* Upper Window */}
      <group position={[0, 1.8, 0.96]}>
        <mesh>
          <boxGeometry args={[0.4, 0.35, 0.04]} />
          <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      </group>
      {/* Side Windows */}
      <group position={[1.16, 1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.04, 0.4, 0.4]} />
          <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.4} />
        </mesh>
      </group>
      <group position={[-1.16, 1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.04, 0.4, 0.4]} />
          <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Cute Flower Box under Front Window */}
      <group position={[-0.55, 0.72, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.12, 0.16]} />
          <meshStandardMaterial color="#5C381E" roughness={0.8} />
        </mesh>
        {/* Flowers */}
        {[-0.15, 0, 0.15].map((fx, fi) => (
          <mesh key={fi} position={[fx, 0.1, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial
              color={fi === 0 ? '#E63946' : fi === 1 ? '#F4A261' : '#9B5DE5'}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** House Type B: Stone Mason Cottage with Slate Roof & Dormer */
export function StoneCottage({
  position,
  rotation = [0, 0, 0],
  roofColor = '#3D5A80',
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  roofColor?: string;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Main Structure */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[2.5, 1.4, 1.9]} />
        <meshStandardMaterial color="#8892A0" roughness={0.92} />
      </mesh>

      {/* Wooden Beam Trims */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.55, 0.08, 1.95]} />
        <meshStandardMaterial color="#4A301D" roughness={0.85} />
      </mesh>

      {/* Hip/Gable Roof */}
      <mesh castShadow receiveShadow position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.8, 1.1, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.65} />
      </mesh>

      {/* Chimney */}
      <group position={[-0.8, 1.9, -0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.35, 1.2, 0.35]} />
          <meshStandardMaterial color="#505763" roughness={0.9} />
        </mesh>
        <ChimneySmoke position={[0, 0.7, 0]} />
      </group>

      {/* Front Porch / Lantern */}
      <group position={[0.4, 0.6, 0.98]}>
        {/* Door */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.9, 0.06]} />
          <meshStandardMaterial color="#54331C" roughness={0.7} />
        </mesh>
        {/* Lantern */}
        <group position={[0.38, 0.3, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.07, 0.12, 6]} />
            <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.08]} />
            <meshStandardMaterial color="#2B1A0E" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Glowing Windows */}
      <mesh position={[-0.55, 0.85, 0.97]}>
        <boxGeometry args={[0.5, 0.45, 0.04]} />
        <meshStandardMaterial color="#FFE066" emissive="#FFD13B" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

/** House Type C: Cozy Circular Thatched/Conical Tower House */
export function RoundCottage({
  position,
  rotation = [0, 0, 0],
  roofColor = '#C66E4E',
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  roofColor?: string;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Cylindrical Body */}
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.1, 1.25, 1.6, 16]} />
        <meshStandardMaterial color="#EDE6D6" roughness={0.85} />
      </mesh>
      {/* Stone Base Ring */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.28, 1.35, 0.4, 16]} />
        <meshStandardMaterial color="#737D8C" roughness={0.9} />
      </mesh>

      {/* Conical Roof */}
      <mesh castShadow receiveShadow position={[0, 2.3, 0]}>
        <coneGeometry args={[1.4, 1.4, 16]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} />
      </mesh>
      {/* Gold Weather Vane / Finial */}
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={NAMAA.gold} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Wooden Arch Door */}
      <mesh castShadow position={[0, 0.6, 1.15]}>
        <boxGeometry args={[0.45, 0.8, 0.1]} />
        <meshStandardMaterial color="#5C3419" roughness={0.8} />
      </mesh>

      {/* Little Chimney */}
      <group position={[0.65, 2.1, 0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.9, 8]} />
          <meshStandardMaterial color="#5E6773" roughness={0.9} />
        </mesh>
        <ChimneySmoke position={[0, 0.5, 0]} />
      </group>
    </group>
  );
}

/** Village Houses Container placed in 4 quadrants */
export function VillageHouses() {
  return (
    <group name="village-residential-houses">
      {/* North Quadrant (between Bank and Farm) */}
      <TimberCottage
        position={[0, 0, -8.5]}
        rotation={[0, 0, 0]}
        roofColor="#C66E4E"
        wallColor="#FAF5E8"
        scale={0.95}
      />
      <StoneCottage
        position={[-3.8, 0, -9.8]}
        rotation={[0, Math.PI / 6, 0]}
        roofColor="#4A6572"
        scale={0.85}
      />
      <RoundCottage
        position={[3.8, 0, -9.8]}
        rotation={[0, -Math.PI / 6, 0]}
        roofColor="#8B84D7"
        scale={0.9}
      />

      {/* South Quadrant (between Windmill and Market) */}
      <TimberCottage
        position={[0, 0, 8.5]}
        rotation={[0, Math.PI, 0]}
        roofColor="#8B84D7"
        wallColor="#F7F1E1"
        scale={0.95}
      />
      <StoneCottage
        position={[3.8, 0, 9.8]}
        rotation={[0, Math.PI * 0.8, 0]}
        roofColor="#D97736"
        scale={0.85}
      />
      <RoundCottage
        position={[-3.8, 0, 9.8]}
        rotation={[0, -Math.PI * 0.8, 0]}
        roofColor="#2A9D8F"
        scale={0.9}
      />

      {/* West Quadrant (between Bank and Windmill) */}
      <TimberCottage
        position={[-9.2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        roofColor="#E76F51"
        scale={0.9}
      />
      <StoneCottage
        position={[-11.5, 0, -3.2]}
        rotation={[0, Math.PI / 3, 0]}
        roofColor="#5C6B73"
        scale={0.85}
      />
      <StoneCottage
        position={[-11.5, 0, 3.2]}
        rotation={[0, Math.PI * 0.7, 0]}
        roofColor="#9B5DE5"
        scale={0.85}
      />

      {/* East Quadrant (North & South of Main Gate Road) */}
      <TimberCottage
        position={[11.5, 0, -3.5]}
        rotation={[0, -Math.PI / 3, 0]}
        roofColor="#D6805E"
        scale={0.88}
      />
      <RoundCottage
        position={[11.5, 0, 3.5]}
        rotation={[0, -Math.PI * 0.7, 0]}
        roofColor="#C66E4E"
        scale={0.88}
      />

      {/* Center Plaza Inner Cottage Nooks */}
      <StoneCottage
        position={[-4.8, 0, -4.5]}
        rotation={[0, Math.PI / 4, 0]}
        roofColor="#3D5A80"
        scale={0.78}
      />
      <TimberCottage
        position={[4.8, 0, 4.5]}
        rotation={[0, -Math.PI * 0.75, 0]}
        roofColor="#B24C34"
        scale={0.78}
      />
    </group>
  );
}
