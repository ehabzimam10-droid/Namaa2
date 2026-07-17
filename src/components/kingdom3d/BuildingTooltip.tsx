import { Html } from '@react-three/drei';
import type { BuildingKey } from './kingdomLogic';
import { BUILDING_INFO, getTierName, getTier } from './kingdomLogic';

interface TooltipProps {
  buildingKey: BuildingKey | 'palace';
  level: number;
  visible: boolean;
  position?: [number, number, number];
}

export function BuildingTooltip({ buildingKey, level, visible, position = [0, 5, 0] }: TooltipProps) {
  if (!visible) return null;

  const info = buildingKey === 'palace' 
    ? { name: 'القصر الملكي الكبير', emoji: '👑', role: 'center' }
    : BUILDING_INFO[buildingKey];
    
  const tier = getTier(level);
  const tierName = getTierName(tier);

  return (
    <Html
      position={position}
      center
      distanceFactor={15}
      zIndexRange={[100, 0]}
      style={{
        transition: 'all 0.2s',
        opacity: visible ? 1 : 0,
        transform: `scale(${visible ? 1 : 0.8})`,
        pointerEvents: 'none'
      }}
    >
      <div 
        dir="rtl"
        className="bg-[#141F35]/90 backdrop-blur-md border border-[#FFD700]/30 rounded-xl p-3 shadow-2xl flex flex-col items-center gap-1 min-w-[140px]"
        style={{
          boxShadow: '0 10px 30px -10px rgba(255, 215, 0, 0.2)',
        }}
      >
        <div className="text-2xl drop-shadow-md">{info.emoji}</div>
        <div className="font-bold text-white whitespace-nowrap">{info.name}</div>
        <div className="flex items-center gap-2 w-full justify-between mt-1 text-sm">
          <span className="text-[#FFD700]">المستوى {level.toLocaleString('ar-EG')}</span>
          <span className="text-[#A5F3FC] text-xs px-2 py-0.5 bg-[#0C1628] rounded-full">{tierName}</span>
        </div>
      </div>
    </Html>
  );
}
