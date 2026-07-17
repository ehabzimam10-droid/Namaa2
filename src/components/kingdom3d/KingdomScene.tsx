import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';

import { Terrain } from './Terrain';
import { GrandPalace } from './GrandPalace';
import { RoyalWall } from './RoyalWall';
import { Treasury } from './Treasury';
import { RoyalGardens } from './RoyalGardens';
import { TradeHarbor } from './TradeHarbor';
import { WisdomTower } from './WisdomTower';

import { type BuildingKey, getTier, computeKingdomLevel } from './kingdomLogic';

interface Props {
  levels: Record<BuildingKey, number>;
}

function SceneAtmosphere() {
  return (
    <>
      <Sky sunPosition={[100, 80, 50]} turbidity={2} rayleigh={0.5} mieCoefficient={0.003} mieDirectionalG={0.9} />
      <fog attach="fog" args={['#c9e8ff', 80, 200]} />

      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight
        position={[20, 40, 10]}
        intensity={2.5}
        color="#fff8e7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-far={120}
      />
      <directionalLight position={[-15, 20, -10]} intensity={0.6} color="#d0eaff" />

      <Clouds material={THREE.MeshStandardMaterial} limit={10}>
        <Cloud position={[30, 18, -20]} bounds={[12, 2, 12]} volume={8} color="#ffffff" opacity={0.9} speed={0.15} />
        <Cloud position={[-30, 22, -10]} bounds={[10, 2, 10]} volume={8} color="#f0f8ff" opacity={0.85} speed={0.2} />
        <Cloud position={[10, 20, 30]} bounds={[14, 2, 14]} volume={10} color="#ffffff" opacity={0.8} speed={0.1} />
      </Clouds>
    </>
  );
}

export function KingdomScene({ levels }: Props) {
  const kingdomLevel = computeKingdomLevel(levels);
  const palaceTier = getTier(kingdomLevel);

  return (
    <Canvas 
      shadows 
      camera={{ position: [22, 18, 22], fov: 42 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <SceneAtmosphere />

      <group position={[0, 0, 0]}>
        <Terrain />
        <RoyalWall level={kingdomLevel} />
        
        {/* rotation.y = π/2 → palace +Z faces gate at [30,0,0] (+X axis) */}
        <group rotation={[0, Math.PI / 2, 0]}>
          <GrandPalace level={kingdomLevel} tier={palaceTier} />
        </group>
        
        {/* rotation.y faces each building's +Z toward the gate at [30,0,0] */}
        <group position={[-16, 0, -16]} rotation={[0, Math.atan2(46, 16), 0]}>
          <Treasury level={levels.treasury} tier={getTier(levels.treasury)} />
        </group>
        
        <group position={[16, 0, -16]} rotation={[0, Math.atan2(14, 16), 0]}>
          <RoyalGardens level={levels.garden} tier={getTier(levels.garden)} />
        </group>
        
        <group position={[16, 0, 16]} rotation={[0, Math.atan2(14, -16), 0]}>
          <TradeHarbor level={levels.harbor} tier={getTier(levels.harbor)} />
        </group>
        
        <group position={[-16, 0, 16]} rotation={[0, Math.atan2(46, -16), 0]}>
          <WisdomTower level={levels.tower} tier={getTier(levels.tower)} />
        </group>
      </group>

      <OrbitControls 
        makeDefault
        autoRotate
        autoRotateSpeed={0.3}
        enablePan={false}
        minDistance={20}
        maxDistance={65}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
      />
    </Canvas>
  );
}
