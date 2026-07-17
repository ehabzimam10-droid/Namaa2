import { Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { BuildingLevels } from './villageLogic';
import { computeVillageLevel, villageTier, tierForLevel } from './villageLogic';
import { Terrain } from './Terrain';
import { Bank } from './Bank';
import { Farm } from './Farm';
import { Market } from './Market';
import { Windmill } from './Windmill';
import { Palace } from './Palace';
import { Wall } from './Wall';

export interface VillageSceneProps {
  levels: BuildingLevels;
  villageLevel?: number;
  autoRotate?: boolean;
  className?: string;
}

/** Detect WebGL support before attempting to mount Three.js Canvas */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/** Fallback shown when WebGL is unavailable */
function WebGLFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0D1527]">
      <div className="text-5xl">🏰</div>
      <p className="text-sm font-black text-yellow-300">القرية ثلاثية الأبعاد</p>
      <p className="max-w-xs text-center text-xs text-slate-400 leading-relaxed">
        هذا المشهد يتطلب WebGL. افتح التطبيق في Chrome أو Firefox أو Edge على جهاز يدعم الرسومات.
      </p>
    </div>
  );
}

/** Error boundary scoped to just the Canvas so failures don't crash the whole page */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <WebGLFallback /> : this.props.children;
  }
}

export default function VillageScene({ levels, villageLevel, autoRotate = false, className }: VillageSceneProps) {
  const vLevel = villageLevel ?? computeVillageLevel(levels);
  const vTier = villageTier(vLevel);

  return (
    <div className={className ?? 'h-full w-full'}>
      {!isWebGLAvailable() ? (
        <WebGLFallback />
      ) : (
        <CanvasBoundary>
          <Canvas camera={{ position: [16, 12, 16], fov: 45 }} dpr={[1, 2]} shadows>
            <fog attach="fog" args={['#c9e8c0', 30, 80]} />
            <color attach="background" args={['#d4eeca']} />

            <ambientLight intensity={0.7} color="#ffffff" />
            <directionalLight
              position={[15, 25, 15]}
              intensity={2.0}
              color="#fff5cc"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={80}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />
            <directionalLight position={[-8, 8, -8]} intensity={0.4} color="#aaddff" />

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

            <group position={[0, 0, 0]}>
              <Terrain />
              <Wall tier={vTier} />
              <Palace tier={vTier} level={vLevel} position={[0, 0, 0]} />
              <Bank tier={tierForLevel(levels.bank)} level={levels.bank} position={[-6.5, 0.4, -6.5]} />
              <Farm tier={tierForLevel(levels.farm)} level={levels.farm} position={[6.5, 0.4, -6.5]} />
              <Market tier={tierForLevel(levels.market)} level={levels.market} position={[6.5, 0.4, 6.5]} />
              <Windmill tier={tierForLevel(levels.windmill)} level={levels.windmill} position={[-6.5, 0.4, 6.5]} />
            </group>
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
