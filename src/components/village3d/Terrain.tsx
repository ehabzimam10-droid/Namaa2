import { useMemo } from 'react';
import * as THREE from 'three';
import { NAMAA } from './palette';

export function Terrain() {
  const dirtGeo = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(7.2, 5, 2.5, 12, 1);
    geometry.translate(0, -1.25, 0);
    return geometry;
  }, []);

  const rocks = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      // Deterministic pseudo-random for position
      const r = 3 + (Math.sin(i * 1.2) * 0.5 + 0.5) * 4;
      const angle = i * (Math.PI * 2) / 8;
      const y = -2 - (Math.cos(i * 2.3) * 0.5 + 0.5) * 2;
      return {
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
        rot: [Math.sin(i), Math.cos(i), Math.sin(i * 2)] as [number, number, number],
        scale: 0.5 + (Math.sin(i * 3) * 0.5 + 0.5) * 0.8
      };
    });
  }, []);

  return (
    <group>
      {/* Grass Top */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[7.2, 7.2, 0.4, 24]} />
        <meshStandardMaterial color={NAMAA.grass} roughness={0.9} />
      </mesh>
      
      {/* Dirt Base */}
      <mesh receiveShadow geometry={dirtGeo}>
        <meshStandardMaterial color={NAMAA.woodDark} roughness={1} />
      </mesh>
      
      {/* Floating rocks underneath */}
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} rotation={rock.rot} scale={rock.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={NAMAA.stoneDark} roughness={1} />
        </mesh>
      ))}
      
      {/* Sandy paths cross */}
      <mesh receiveShadow position={[0, 0.21, 0]} rotation={[-Math.PI/2, 0, Math.PI/4]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color={NAMAA.sand} roughness={1} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
