import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { BuildingLevels } from './villageLogic';
import { computeVillageLevel, villageTier, tierForLevel } from './villageLogic';
import { Terrain } from './Terrain';
import { Bank } from './Bank';
import { Farm } from './Farm';
import { Market } from './Market';
import { Windmill } from './Windmill';
import { Palace } from './Palace';
import { Wall } from './Wall';
import { NAMAA } from './palette';

export interface VillageSceneProps {
  levels: BuildingLevels;
  villageLevel?: number;
  autoRotate?: boolean;
  className?: string;
}

function ProceduralClouds() {
  const clouds = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      pos: new THREE.Vector3(
        (Math.sin(i * 2.1) - 0.5) * 30,
        (Math.cos(i * 1.5) * 0.5 + 0.5) * 4 - 4,
        (Math.sin(i * 3.4) - 0.5) * 30
      ),
      scale: Math.random() * 2 + 2,
      speed: Math.random() * 0.2 + 0.1,
    }));
  }, []);

  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.children.forEach((c, i) => {
        c.position.x += clouds[i].speed * delta;
        if (c.position.x > 25) c.position.x = -25;
      });
    }
  });

  return (
    <group ref={ref}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={NAMAA.cloud} transparent opacity={0.2} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export default function VillageScene({ levels, villageLevel, autoRotate = false, className }: VillageSceneProps) {
  const vLevel = villageLevel ?? computeVillageLevel(levels);
  const vTier = villageTier(vLevel);

  return (
    <div className={className ?? 'h-full w-full'}>
      <Canvas camera={{ position: [16, 14, 16], fov: 45 }} dpr={[1, 2]} shadows>
        <fog attach="fog" args={[NAMAA.night, 20, 50]} />
        
        <ambientLight intensity={0.4} color={NAMAA.purple} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          color={NAMAA.goldLight} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, 5, -10]} intensity={0.2} color={NAMAA.purpleBright} />
        
        <Stars radius={60} depth={30} count={2500} factor={4} saturation={0.5} fade speed={1} />
        <Sparkles count={80} scale={20} size={3} speed={0.4} opacity={0.3} color={NAMAA.gold} />
        <ProceduralClouds />

        <OrbitControls 
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          minDistance={12}
          maxDistance={35}
          enableDamping
        />

        <group position={[0, -2, 0]}>
          <Terrain />
          <Wall tier={vTier} />
          <Palace tier={vTier} level={vLevel} position={[0, 0, 0]} />
          
          <Bank tier={tierForLevel(levels.bank)} level={levels.bank} position={[-3.8, 0.4, -3.8]} />
          <Farm tier={tierForLevel(levels.farm)} level={levels.farm} position={[3.8, 0.4, -3.8]} />
          <Market tier={tierForLevel(levels.market)} level={levels.market} position={[3.8, 0.4, 3.8]} />
          <Windmill tier={tierForLevel(levels.windmill)} level={levels.windmill} position={[-3.8, 0.4, 3.8]} />
        </group>
      </Canvas>
    </div>
  );
}
