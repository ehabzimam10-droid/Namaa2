import { useMemo } from 'react';

/** Detailed Low-Poly Oak / Apple Tree */
export function OakTree({
  position,
  scale = 1,
  hasApples = false,
  foliageColor = '#3A7D44',
}: {
  position: [number, number, number];
  scale?: number;
  hasApples?: boolean;
  foliageColor?: string;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 1.4, 7]} />
        <meshStandardMaterial color="#6B4226" roughness={0.9} />
      </mesh>
      {/* Root flares */}
      <mesh receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.2, 5]} />
        <meshStandardMaterial color="#54331C" roughness={0.95} />
      </mesh>

      {/* Foliage Clusters */}
      <group position={[0, 1.8, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <dodecahedronGeometry args={[0.95, 0]} />
          <meshStandardMaterial color={foliageColor} roughness={0.85} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.35, 0.2]}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={foliageColor} roughness={0.85} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.35, 0.25, -0.3]}>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color={foliageColor} roughness={0.85} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={foliageColor} roughness={0.85} flatShading />
        </mesh>

        {/* Optional Red Apples */}
        {hasApples && (
          <>
            {[
              [0.45, -0.2, 0.6],
              [-0.5, 0.1, 0.5],
              [0.6, 0.2, -0.3],
              [-0.4, -0.1, -0.55],
              [0.1, -0.35, 0.7],
            ].map(([ax, ay, az], i) => (
              <mesh key={i} position={[ax, ay, az]}>
                <sphereGeometry args={[0.09, 6, 6]} />
                <meshStandardMaterial color="#E63946" roughness={0.4} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
}

/** Slender Tall Pine / Conifer Tree */
export function PineTree({
  position,
  scale = 1,
  color = '#1E5235',
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.6, 6]} />
        <meshStandardMaterial color="#4A2E1B" roughness={0.9} />
      </mesh>

      {/* Layered Cones */}
      <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
        <coneGeometry args={[1.3, 1.4, 7]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.3, 0]}>
        <coneGeometry args={[1.05, 1.3, 7]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.0, 0]}>
        <coneGeometry args={[0.75, 1.2, 7]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.6, 0]}>
        <coneGeometry args={[0.45, 0.9, 7]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

/** Cherry Blossom / Flowering Tree */
export function CherryBlossomTree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 1.3, 6]} />
        <meshStandardMaterial color="#593B26" roughness={0.9} />
      </mesh>
      {/* Pink & Lavender Puff Foliage */}
      <group position={[0, 1.7, 0]}>
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#FFB5C5" roughness={0.8} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.3, 0.2]}>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color="#FFA4B6" roughness={0.8} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.35, 0.2, -0.3]}>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color="#F490A7" roughness={0.8} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#FFCAD4" roughness={0.8} flatShading />
        </mesh>
      </group>
    </group>
  );
}

/** Natural Boulder / Rock Cluster */
export function RockCluster({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.28, 0]} rotation={[0.4, 0.6, 0.2]}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#7A8494" roughness={0.92} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 0.18, 0.2]} rotation={[-0.3, 0.8, -0.2]}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#666F7D" roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.3, 0.14, 0.25]} rotation={[0.2, -0.5, 0.4]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#8893A3" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

/** Flower Garden Bed */
export function FlowerBed({
  position,
  width = 1.6,
  length = 0.8,
}: {
  position: [number, number, number];
  width?: number;
  length?: number;
}) {
  return (
    <group position={position}>
      {/* Soil base */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[width, 0.08, length]} />
        <meshStandardMaterial color="#4A2F1C" roughness={1} />
      </mesh>
      {/* Stone curb */}
      <mesh receiveShadow position={[0, 0.07, 0]}>
        <boxGeometry args={[width + 0.15, 0.06, length + 0.15]} />
        <meshStandardMaterial color="#808B9B" roughness={0.9} wireframe={false} />
      </mesh>
      {/* Colored flower heads */}
      {[-0.5, -0.2, 0.1, 0.4].map((fx, i) =>
        [-0.2, 0.2].map((fz, j) => (
          <mesh key={`${i}-${j}`} position={[fx + (j % 2) * 0.05, 0.18, fz]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshStandardMaterial
              color={
                (i + j) % 3 === 0
                  ? '#E63946'
                  : (i + j) % 3 === 1
                  ? '#F4A261'
                  : '#9B5DE5'
              }
              roughness={0.5}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Distant Backdrop Mountains ringing the horizon */
function MountainBackdrop() {
  const mountains = useMemo(() => {
    const items: Array<{ x: number; z: number; height: number; radius: number; color: string }> = [];
    const count = 22;
    const colors = ['#4A6B5B', '#3E5C4E', '#567A68', '#426353', '#395345'];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 36 + (i % 3) * 3;
      items.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        height: 8 + (i % 5) * 3.2,
        radius: 6 + (i % 4) * 1.5,
        color: colors[i % colors.length],
      });
    }
    return items;
  }, []);

  return (
    <group name="distant-mountain-backdrop">
      {mountains.map((m, idx) => (
        <group key={idx} position={[m.x, 0, m.z]}>
          {/* Mountain base cone */}
          <mesh receiveShadow position={[0, m.height / 2, 0]}>
            <coneGeometry args={[m.radius, m.height, 7]} />
            <meshStandardMaterial color={m.color} roughness={0.95} flatShading />
          </mesh>
          {/* Snow cap on higher peaks */}
          {m.height > 12 && (
            <mesh position={[0, m.height - 1.2, 0]}>
              <coneGeometry args={[m.radius * 0.28, 2.5, 7]} />
              <meshStandardMaterial color="#F0F4F8" roughness={0.7} flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

export function ForestAndNature() {
  // Dense pine forest coordinates outside the circular city wall (R = 18)
  const outerPines = useMemo(() => {
    const pines: Array<{ x: number; z: number; scale: number; color: string }> = [];
    const pineColors = ['#1D4A2F', '#245939', '#183D27', '#2E6E47', '#1F4730'];

    // Place trees in concentric rings between r=19.5 and r=34
    for (let r = 19.8; r < 34; r += 2.2) {
      const count = Math.floor(r * 3.2);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + (r * 0.4);
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        // Leave clear path near main gate at +X (theta near 0)
        if (x > 17 && Math.abs(z) < 3.2) continue;

        pines.push({
          x,
          z,
          scale: 0.75 + Math.sin(i * 3 + r) * 0.35 + (r > 28 ? 0.3 : 0),
          color: pineColors[Math.floor(Math.random() * pineColors.length)],
        });
      }
    }
    return pines;
  }, []);

  return (
    <group name="forest-and-nature">
      {/* 1. Distant Mountain Range */}
      <MountainBackdrop />

      {/* 2. Outer Wilderness Dense Pine Forest */}
      {outerPines.map((p, idx) => (
        <PineTree key={idx} position={[p.x, 0, p.z]} scale={p.scale} color={p.color} />
      ))}

      {/* Outer natural rock boulders */}
      <RockCluster position={[21, 0, 8]} scale={1.5} />
      <RockCluster position={[22, 0, -9]} scale={1.3} />
      <RockCluster position={[-20, 0, 12]} scale={1.8} />
      <RockCluster position={[-21, 0, -14]} scale={1.6} />
      <RockCluster position={[6, 0, -22]} scale={1.4} />
      <RockCluster position={[-7, 0, 22]} scale={1.7} />

      {/* 3. Inner Village Trees & Greenery */}
      {/* Near Central Plaza */}
      <CherryBlossomTree position={[-2.8, 0, 2.8]} scale={1.1} />
      <CherryBlossomTree position={[2.8, 0, -2.8]} scale={1.1} />
      <OakTree position={[-2.8, 0, -2.8]} scale={1.05} hasApples={true} foliageColor="#387A42" />
      <OakTree position={[2.8, 0, 2.8]} scale={1.05} foliageColor="#2F6E39" />

      {/* Orchard near Farm Quadrant */}
      <OakTree position={[6.2, 0, -11.8]} scale={1.2} hasApples={true} foliageColor="#357D42" />
      <OakTree position={[9.8, 0, -12.5]} scale={1.1} hasApples={true} foliageColor="#428A4F" />
      <OakTree position={[12.5, 0, -9.5]} scale={1.15} hasApples={true} foliageColor="#30723D" />

      {/* Greenery near Bank & Treasury */}
      <PineTree position={[-12.5, 0, -9.5]} scale={1.1} color="#1E5235" />
      <PineTree position={[-6.2, 0, -12.2]} scale={1.0} color="#276342" />
      <OakTree position={[-12.0, 0, -6.5]} scale={0.95} foliageColor="#3E7C4F" />

      {/* Greenery near Windmill & Pastures */}
      <OakTree position={[-12.5, 0, 9.5]} scale={1.1} foliageColor="#4A8757" />
      <OakTree position={[-6.2, 0, 12.2]} scale={1.0} foliageColor="#3E7C4F" />
      <PineTree position={[-12.0, 0, 6.5]} scale={0.95} color="#215437" />

      {/* Greenery near Market */}
      <CherryBlossomTree position={[12.5, 0, 9.5]} scale={1.05} />
      <OakTree position={[6.2, 0, 12.2]} scale={1.0} foliageColor="#357D42" />
      <PineTree position={[12.0, 0, 6.5]} scale={0.95} color="#1E5235" />

      {/* 4. Flower Beds along main avenues */}
      <FlowerBed position={[6.0, 0, 1.6]} width={2.2} length={0.7} />
      <FlowerBed position={[6.0, 0, -1.6]} width={2.2} length={0.7} />
      <FlowerBed position={[11.0, 0, 1.6]} width={2.2} length={0.7} />
      <FlowerBed position={[11.0, 0, -1.6]} width={2.2} length={0.7} />
      <FlowerBed position={[-1.6, 0, 6.0]} width={0.7} length={2.2} />
      <FlowerBed position={[1.6, 0, 6.0]} width={0.7} length={2.2} />
      <FlowerBed position={[-1.6, 0, -6.0]} width={0.7} length={2.2} />
      <FlowerBed position={[1.6, 0, -6.0]} width={0.7} length={2.2} />
    </group>
  );
}
