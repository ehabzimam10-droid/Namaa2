import { useMemo } from 'react';
import { NAMAA } from './palette';

/** Cobblestone / flagstone road segment with subtle stone variations */
function RoadSegment({
  start,
  end,
  width = 1.8,
  color = '#8E9AA8',
  edgeColor = '#687382',
}: {
  start: [number, number];
  end: [number, number];
  width?: number;
  color?: string;
  edgeColor?: string;
}) {
  const [x1, z1] = start;
  const [x2, z2] = end;
  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;

  return (
    <group position={[cx, 0.02, cz]} rotation={[0, -angle, 0]}>
      {/* Main road bed */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      {/* Left stone curb */}
      <mesh receiveShadow position={[0, 0.02, width / 2]}>
        <boxGeometry args={[length, 0.04, 0.15]} />
        <meshStandardMaterial color={edgeColor} roughness={0.88} />
      </mesh>
      {/* Right stone curb */}
      <mesh receiveShadow position={[0, 0.02, -width / 2]}>
        <boxGeometry args={[length, 0.04, 0.15]} />
        <meshStandardMaterial color={edgeColor} roughness={0.88} />
      </mesh>
    </group>
  );
}

/** Circular stone plaza around central landmarks like the palace */
function CentralPlaza({ radius = 4.2 }: { radius?: number }) {
  const stonePatches = useMemo(() => {
    const items: Array<{ x: number; z: number; size: number; rot: number; color: string }> = [];
    const colors = ['#8A96A6', '#98A4B5', '#7F8B9B', '#A8B3C2'];
    for (let r = 1.2; r < radius; r += 0.9) {
      const count = Math.floor(r * 6.2);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + (r * 0.5);
        items.push({
          x: Math.cos(theta) * r,
          z: Math.sin(theta) * r,
          size: 0.35 + Math.random() * 0.25,
          rot: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }
    return items;
  }, [radius]);

  return (
    <group position={[0, 0.025, 0]}>
      {/* Base plaza circle */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial color="#8895A5" roughness={0.9} />
      </mesh>
      {/* Outer curb ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius - 0.2, radius + 0.1, 48]} />
        <meshStandardMaterial color="#5E6B7C" roughness={0.85} />
      </mesh>
      {/* Inner decorative ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[radius * 0.5 - 0.1, radius * 0.5 + 0.1, 32]} />
        <meshStandardMaterial color={NAMAA.goldDark} roughness={0.7} />
      </mesh>

      {/* Discrete decorative stones */}
      {stonePatches.map((stone, idx) => (
        <mesh
          key={idx}
          receiveShadow
          position={[stone.x, 0.02, stone.z]}
          rotation={[-Math.PI / 2, 0, stone.rot]}
        >
          <planeGeometry args={[stone.size, stone.size * 0.8]} />
          <meshStandardMaterial color={stone.color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** Stepping stone pathway */
function SteppingStonePath({ points }: { points: [number, number][] }) {
  return (
    <group position={[0, 0.03, 0]}>
      {points.map(([x, z], i) => (
        <mesh
          key={i}
          receiveShadow
          position={[x + (Math.sin(i * 3) * 0.1), 0, z + (Math.cos(i * 4) * 0.1)]}
          rotation={[-Math.PI / 2, 0, i * 0.4]}
        >
          <cylinderGeometry args={[0.35 + (i % 3) * 0.06, 0.38 + (i % 3) * 0.06, 0.04, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#9AA6B7' : '#8490A0'} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

export function RoadsAndPaths() {
  // Stepping stones branching off to residential nooks
  const northWestSteps: [number, number][] = [
    [-3.8, -1.5], [-4.4, -2.2], [-5.0, -2.8], [-5.6, -3.5], [-6.2, -4.2]
  ];
  const southEastSteps: [number, number][] = [
    [3.8, 1.5], [4.4, 2.2], [5.0, 2.8], [5.6, 3.5], [6.2, 4.2]
  ];
  const northEastSteps: [number, number][] = [
    [3.8, -1.5], [4.4, -2.2], [5.0, -2.8], [5.6, -3.5], [6.2, -4.2]
  ];
  const southWestSteps: [number, number][] = [
    [-3.8, 1.5], [-4.4, 2.2], [-5.0, 2.8], [-5.6, 3.5], [-6.2, 4.2]
  ];

  return (
    <group name="village-roads-and-paths">
      {/* 1. Grand Center Plaza */}
      <CentralPlaza radius={4.5} />

      {/* 2. Main Avenue: Plaza to East Gate (+X) */}
      <RoadSegment start={[4.2, 0]} end={[17.8, 0]} width={2.4} color="#94A0B0" edgeColor="#5E6B7C" />
      {/* Outside the gate trail */}
      <RoadSegment start={[18.2, 0]} end={[26.0, 0]} width={2.0} color="#C4B38A" edgeColor="#9E8D64" />

      {/* 3. Avenues to Landmark Buildings */}
      {/* North-West Avenue to Bank [-8.5, -8.5] */}
      <RoadSegment start={[-3.0, -3.0]} end={[-7.2, -7.2]} width={1.8} />
      {/* North-East Avenue to Farm [8.5, -8.5] */}
      <RoadSegment start={[3.0, -3.0]} end={[7.2, -7.2]} width={1.8} />
      {/* South-East Avenue to Market [8.5, 8.5] */}
      <RoadSegment start={[3.0, 3.0]} end={[7.2, 7.2]} width={1.8} />
      {/* South-West Avenue to Windmill [-8.5, 8.5] */}
      <RoadSegment start={[-3.0, 3.0]} end={[-7.2, 7.2]} width={1.8} />

      {/* 4. Cardinal Circular Connecting Ring Avenue */}
      <RoadSegment start={[0, -4.2]} end={[0, -11.0]} width={1.5} color="#8A96A6" />
      <RoadSegment start={[0, 4.2]} end={[0, 11.0]} width={1.5} color="#8A96A6" />
      <RoadSegment start={[-4.2, 0]} end={[-11.0, 0]} width={1.5} color="#8A96A6" />

      {/* Outer connecting ring between landmarks */}
      <RoadSegment start={[-7.2, -7.2]} end={[0, -10.5]} width={1.3} color="#838F9F" />
      <RoadSegment start={[0, -10.5]} end={[7.2, -7.2]} width={1.3} color="#838F9F" />
      <RoadSegment start={[7.2, -7.2]} end={[10.5, 0]} width={1.3} color="#838F9F" />
      <RoadSegment start={[10.5, 0]} end={[7.2, 7.2]} width={1.3} color="#838F9F" />
      <RoadSegment start={[7.2, 7.2]} end={[0, 10.5]} width={1.3} color="#838F9F" />
      <RoadSegment start={[0, 10.5]} end={[-7.2, 7.2]} width={1.3} color="#838F9F" />
      <RoadSegment start={[-7.2, 7.2]} end={[-10.5, 0]} width={1.3} color="#838F9F" />
      <RoadSegment start={[-10.5, 0]} end={[-7.2, -7.2]} width={1.3} color="#838F9F" />

      {/* 5. Stepping stone side-paths to houses */}
      <SteppingStonePath points={northWestSteps} />
      <SteppingStonePath points={southEastSteps} />
      <SteppingStonePath points={northEastSteps} />
      <SteppingStonePath points={southWestSteps} />
    </group>
  );
}
