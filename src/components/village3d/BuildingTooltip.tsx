import { Html } from '@react-three/drei';
import { BUILDING_INFO, type BuildingKey, type Tier } from './villageLogic';
import { NAMAA } from './palette';

interface TooltipProps {
  bKey: BuildingKey;
  level: number;
  tier: Tier;
  visible: boolean;
}

const TIER_LABEL: Record<Tier, string> = {
  1: 'الشكل الأول',
  2: 'الشكل الثاني',
  3: 'الشكل الأسطوري',
};

export function BuildingTooltip({ bKey, level, tier, visible }: TooltipProps) {
  const info = BUILDING_INFO[bKey];
  return (
    <Html
      position={[0, 2.5, 0]}
      center
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
        direction: 'rtl',
        zIndex: 10,
      }}
    >
      <div
        className="w-44 rounded-xl border border-white/20 px-3 py-2 shadow-2xl backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(32,42,68,0.9), rgba(17,28,46,0.9))',
          color: NAMAA.white,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{info.emoji}</span>
          <div>
            <div className="text-xs font-bold text-yellow-300">{info.nameAr}</div>
            <div className="text-[10px] text-slate-300">
              المستوى {level} · {info.basisAr}
            </div>
            <div className="text-[10px] font-bold text-purple-300">{TIER_LABEL[tier]}</div>
          </div>
        </div>
      </div>
    </Html>
  );
}
