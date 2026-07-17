import { KINGDOM } from './palette';

export function Terrain() {
  return (
    <group>
      {/* Wide flat green ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.95} />
      </mesh>

      {/* Inner lighter green plaza */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[19.5, 64]} />
        <meshStandardMaterial color="#3A7A32" roughness={0.8} />
      </mesh>

      {/* Golden decorative border ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[19, 19.5, 64]} />
        <meshStandardMaterial color={KINGDOM.gold} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Inner gold accent ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.8, 4.2, 48]} />
        <meshStandardMaterial color={KINGDOM.goldDeep} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Path to Northwest (Treasury) */}
      <mesh receiveShadow position={[-4.5, 0.015, -4.5]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <planeGeometry args={[2, 11]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      {/* Path to Northeast (Gardens) */}
      <mesh receiveShadow position={[4.5, 0.015, -4.5]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[2, 11]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      {/* Path to Southeast (Harbor) */}
      <mesh receiveShadow position={[4.5, 0.015, 4.5]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <planeGeometry args={[2, 11]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      {/* Path to Southwest (Tower) */}
      <mesh receiveShadow position={[-4.5, 0.015, 4.5]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[2, 11]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>
    </group>
  );
}
