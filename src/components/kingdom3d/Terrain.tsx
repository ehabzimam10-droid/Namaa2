import { KINGDOM } from './palette';

export function Terrain() {
  return (
    <group>
      {/* Wide flat green ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.95} />
      </mesh>

      {/* Inner lighter green plaza — matches wall radius 30 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[30.8, 64]} />
        <meshStandardMaterial color="#3A7A32" roughness={0.8} />
      </mesh>

      {/* Golden decorative border ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[30.3, 30.8, 64]} />
        <meshStandardMaterial color={KINGDOM.gold} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Inner gold accent ring around palace */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.0, 4.4, 48]} />
        <meshStandardMaterial color={KINGDOM.goldDeep} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Diagonal stone paths — midpoint ±8, length 18 covers center ring to buildings at ±16 */}
      <mesh receiveShadow position={[-8, 0.015, -8]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <planeGeometry args={[2.4, 18]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      <mesh receiveShadow position={[8, 0.015, -8]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[2.4, 18]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      <mesh receiveShadow position={[8, 0.015, 8]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <planeGeometry args={[2.4, 18]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>

      <mesh receiveShadow position={[-8, 0.015, 8]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[2.4, 18]} />
        <meshStandardMaterial color={KINGDOM.stone} roughness={0.9} />
      </mesh>
    </group>
  );
}
