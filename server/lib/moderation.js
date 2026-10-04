const PROFANITY_SQ = [
  'kar', 'qif', 'mut', 'pidh', 'kurv', 'shpif', 'debil', 'retard',
];

const SELF_HARM_PATTERNS = [
  /\b(vras|vrau|vetëvrasje|vetevrasje|dua të vdes|nuk dua të jetoj|nuk dua te jetoj)\b/i,
  /\b(prej vetëvetes|prej vetevetes|lë veten|le veten)\b/i,
  /\b(suicide|kill myself|want to die|hurt myself)\b/i,
];

const NAME_PATTERNS = [
  /\b(emri im është|quhem|my name is|i am called)\b/i,
  /\b(nxënësi|nxenesi|profesori|profesore)\s+[A-ZÇË][a-zçë]+/,
];

const COMMON_FIRST_NAMES_SQ = [
  'arben', 'besnik', 'drin', 'elona', 'erion', 'fatmir', 'gent', 'luljeta',
  'mark', 'nora', 'rinor', 'sara', 'valbona', 'altin', 'anila', 'dritan',
];

export function analyzeStory(text) {
  const lower = text.toLowerCase();
  const flaggedProfanity = PROFANITY_SQ.some((w) => lower.includes(w));
  const flaggedSelfHarm = SELF_HARM_PATTERNS.some((re) => re.test(text));
  const flaggedNames =
    NAME_PATTERNS.some((re) => re.test(text)) ||
    COMMON_FIRST_NAMES_SQ.some((name) => {
      const re = new RegExp(`\\b${name}\\b`, 'i');
      return re.test(lower);
    });

  return { flaggedProfanity, flaggedSelfHarm, flaggedNames };
}

export function filterPublicText(text) {
  let out = text;
  for (const w of PROFANITY_SQ) {
    const re = new RegExp(w, 'gi');
    out = out.replace(re, '***');
  }
  return out;
}

export function analyzeReply(text) {
  return analyzeStory(text);
}
