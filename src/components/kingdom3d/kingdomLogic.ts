export type BuildingKey = 'treasury' | 'garden' | 'harbor' | 'tower';

export const BUILDING_INFO = {
  treasury: { name: 'خزينة المملكة', emoji: '💰', role: 'savings' },
  garden: { name: 'الحدائق الملكية', emoji: '🌳', role: 'charity' },
  harbor: { name: 'ميناء التجارة', emoji: '🚢', role: 'investment' },
  tower: { name: 'برج الحكمة', emoji: '📜', role: 'tasks' }
} as const;

export function getTier(level: number): 1 | 2 | 3 {
  if (level <= 2) return 1;
  if (level <= 4) return 2;
  return 3;
}

export function computeKingdomLevel(levels: Record<BuildingKey, number>): number {
  const sum = levels.treasury + levels.garden + levels.harbor + levels.tower;
  const avg = sum / 4;
  return Math.min(5, Math.max(1, Math.round(avg)));
}

export function getTierName(tier: 1 | 2 | 3): string {
  switch (tier) {
    case 1: return 'المرحلة الأساسية';
    case 2: return 'المرحلة المتوسطة';
    case 3: return 'المرحلة الأسطورية';
  }
}
