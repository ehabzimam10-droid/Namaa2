import { NAMAA } from './palette';

export function Terrain() {
  return (
    <group>
      {/* Flat ground — large plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={NAMAA.grass} roughness={0.95} />
      </mesh>

      {/* Inner sandy paths */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={NAMAA.sand} roughness={1} transparent opacity={0.55} />
      </mesh>

      {/* Outer darker ground ring for depth */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[8, 40, 48]} />
        <meshStandardMaterial color="#2d5a3d" roughness={1} />
      </mesh>
    </group>
  );
}
