/**
 * ============================================================
 *  منطق تطور قرية نماء الافتراضية (الابن)
 * ============================================================
 *  - كل مبنى أساس له مستوى من 1 إلى 5، ويُعرض بثلاثة أطوار شكلية:
 *      المستويان 1-2  → الطور الأول  (بسيط)
 *      المستويان 3-4  → الطور الثاني (متوسط)
 *      المستوى  5     → الطور الثالث (أسطوري)
 *  - مستوى القرية العام (1-5) يُحسب تلقائياً من أطوار المباني:
 *      المستوى 2: وصول 3 مبانٍ على الأقل إلى الطور الثاني
 *      المستوى 3: وصول جميع المباني إلى الطور الثاني على الأقل
 *      المستوى 4: وصول 3 مبانٍ على الأقل إلى الطور الثالث
 *      المستوى 5: وصول جميع المباني إلى الطور الثالث
 *  - القلعة المركزية والسور يعكسان مستوى القرية العام:
 *      المستويان 1-2 → الطور الأول، 3-4 → الطور الثاني، 5 → الطور الثالث
 *  - قيد التوازن: لا يُسمح لمبنى أن يتقدم بأكثر من طور واحد فوق
 *    أدنى طور بين بقية المباني (MAX_TIER_GAP).
 *    ملاحظة: لوحة تحكم المطورين لا تفرض القيد (للمعاينة الحرة)،
 *    لكنها تُظهر تنبيهاً — ويُستخدم القيد لاحقاً عند الربط بالذكاء
 *    الاصطناعي عبر isLevelAllowed / maxAllowedLevel.
 * ============================================================
 */

export type BuildingKey = 'bank' | 'farm' | 'market' | 'windmill';
export type Tier = 1 | 2 | 3;

export interface BuildingLevels {
  /** البنك العائلي — الادخار */
  bank: number;
  /** واحة التبرعات — التبرع */
  farm: number;
  /** سوق الاستثمار — الاستثمار */
  market: number;
  /** طاحونة المهام — المهام الشخصية */
  windmill: number;
}

export const BUILDING_KEYS: readonly BuildingKey[] = ['bank', 'farm', 'market', 'windmill'] as const;

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 5;
export const MIN_VILLAGE_LEVEL = 1;
export const MAX_VILLAGE_LEVEL = 5;

/** أقصى فارق مسموح بين طور مبنى وأدنى طور بين بقية المباني */
export const MAX_TIER_GAP = 1;

export const BUILDING_INFO: Record<BuildingKey, { nameAr: string; basisAr: string; emoji: string }> = {
  bank: { nameAr: 'البنك العائلي', basisAr: 'الادخار', emoji: '💰' },
  farm: { nameAr: 'واحة التبرعات', basisAr: 'التبرع', emoji: '💚' },
  market: { nameAr: 'سوق الاستثمار', basisAr: 'الاستثمار', emoji: '📈' },
  windmill: { nameAr: 'طاحونة المهام', basisAr: 'المهام الشخصية', emoji: '🌀' },
};

export function clampLevel(level: number): number {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(level)));
}

/** المستويان 1-2 → الطور 1، المستويان 3-4 → الطور 2، المستوى 5 → الطور 3 */
export function tierForLevel(level: number): Tier {
  const l = clampLevel(level);
  if (l >= 5) return 3;
  if (l >= 3) return 2;
  return 1;
}

/** حساب مستوى القرية العام (1-5) من مستويات المباني الأربعة */
export function computeVillageLevel(levels: BuildingLevels): number {
  const tiers = BUILDING_KEYS.map((k) => tierForLevel(levels[k]));
  const total = BUILDING_KEYS.length;
  const atOrAboveTier2 = tiers.filter((t) => t >= 2).length;
  const atTier3 = tiers.filter((t) => t === 3).length;

  if (atTier3 === total) return 5;
  if (atTier3 >= 3) return 4;
  if (atOrAboveTier2 === total) return 3;
  if (atOrAboveTier2 >= 3) return 2;
  return 1;
}

/** طور القلعة المركزية والسور من مستوى القرية العام */
export function villageTier(villageLevel: number): Tier {
  if (villageLevel >= 5) return 3;
  if (villageLevel >= 3) return 2;
  return 1;
}

/**
 * قيد التوازن: هل يُسمح بوصول المبنى إلى هذا المستوى؟
 * (طوره الجديد لا يتجاوز أدنى طور بين بقية المباني + MAX_TIER_GAP)
 */
export function isLevelAllowed(levels: BuildingLevels, key: BuildingKey, newLevel: number): boolean {
  const targetTier = tierForLevel(clampLevel(newLevel));
  const otherTiers = BUILDING_KEYS.filter((k) => k !== key).map((k) => tierForLevel(levels[k]));
  const minOtherTier = Math.min(...otherTiers);
  return targetTier - minOtherTier <= MAX_TIER_GAP;
}

/** أعلى مستوى مسموح به حالياً لمبنى معين وفق قيد التوازن */
export function maxAllowedLevel(levels: BuildingLevels, key: BuildingKey): number {
  let allowed = MIN_LEVEL;
  for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
    if (isLevelAllowed(levels, key, l)) allowed = l;
  }
  return allowed;
}

/** المباني المخالفة حالياً لقيد التوازن (لإظهار تنبيه في لوحة المطورين) */
export function violatingBuildings(levels: BuildingLevels): BuildingKey[] {
  return BUILDING_KEYS.filter((k) => !isLevelAllowed(levels, k, levels[k]));
}

/** تلميح عربي بالخطوة المطلوبة للوصول لمستوى القرية التالي */
export function nextVillageMilestone(levels: BuildingLevels): string | null {
  const v = computeVillageLevel(levels);
  if (v >= MAX_VILLAGE_LEVEL) return null;
  const tiers = BUILDING_KEYS.map((k) => tierForLevel(levels[k]));
  const atOrAboveTier2 = tiers.filter((t) => t >= 2).length;
  const atTier3 = tiers.filter((t) => t === 3).length;

  switch (v) {
    case 1:
      return `طوِّر ${3 - atOrAboveTier2} من المباني إلى الشكل الثاني (مستوى 3+) ليصبح مستوى القرية 2`;
    case 2:
      return 'أوصل بقية المباني إلى الشكل الثاني (مستوى 3+) ليصبح مستوى القرية 3';
    case 3:
      return `أوصل ${3 - atTier3} من المباني إلى الشكل الأسطوري (مستوى 5) ليصبح مستوى القرية 4`;
    case 4:
      return 'أوصل جميع المباني إلى الشكل الأسطوري (مستوى 5) لتتويج قريتك بالمستوى 5';
    default:
      return null;
  }
}
