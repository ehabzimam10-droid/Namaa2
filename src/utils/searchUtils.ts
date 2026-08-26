/**
 * Normalizes Arabic text by stripping diacritics and unifying letters.
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove tatweel
    .replace(/\u0640/g, '')
    // Normalize alef variants (أ إ آ ٱ => ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize taa marbouta (ة => ه)
    .replace(/ة/g, 'ه')
    // Normalize yaa variants (ى => ي)
    .replace(/ى/g, 'ي')
    .trim()
    .toLowerCase();
}

/**
 * Searches if query matches target with smart weighted score.
 */
export function matchArabic(target: string, query: string): boolean {
  if (!query) return true;
  const nTarget = normalizeArabic(target);
  const nQuery = normalizeArabic(query);
  return nTarget.includes(nQuery);
}
