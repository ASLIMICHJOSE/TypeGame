import wordBanks from '../data/wordBanks';

/**
 * Generate a random passage from a given level's word bank.
 * Returns a string of words separated by spaces.
 */
export function generatePassage(levelId, minChars = 300) {
  const bank = wordBanks[levelId] || wordBanks.ember;
  const words = [];
  let totalChars = 0;

  while (totalChars < minChars) {
    const word = bank[Math.floor(Math.random() * bank.length)];
    words.push(word);
    totalChars += word.length + 1; // +1 for space
  }

  return words.join(' ');
}

/**
 * Calculate WPM: (characters typed / 5) / elapsed minutes
 */
export function calculateWPM(charsTyped, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round((charsTyped / 5) / minutes);
}

/**
 * Calculate accuracy: (correct / total) × 100
 */
export function calculateAccuracy(correct, total) {
  if (total <= 0) return 100;
  return Math.round((correct / total) * 1000) / 10;
}

/**
 * Calculate XP: (WPM × accuracy / 10) + (maxCombo × 2)
 */
export function calculateXP(wpm, accuracy, maxCombo) {
  return Math.round((wpm * accuracy / 10) + (maxCombo * 2));
}

/**
 * Get rank label based on WPM
 */
export function getRank(wpm) {
  if (wpm >= 90) return { label: '👑 TYPEKING', color: '#bf00ff' };
  if (wpm >= 70) return { label: '💀 INFERNO', color: '#ff1a1a' };
  if (wpm >= 50) return { label: '⚡ STORM', color: '#ffd700' };
  if (wpm >= 30) return { label: '🔥 BLAZE', color: '#ff4e00' };
  return { label: '🌱 EMBER', color: '#ff8c00' };
}

/**
 * Get the level label for a given WPM (for leaderboard)
 */
export function getLevelLabel(wpm) {
  if (wpm >= 90) return 'legend';
  if (wpm >= 70) return 'inferno';
  if (wpm >= 50) return 'storm';
  if (wpm >= 30) return 'blaze';
  return 'ember';
}

/**
 * Combo milestones
 */
export const COMBO_MILESTONES = [
  { threshold: 100, text: '💀 GODLIKE!', color: '#bf00ff' },
  { threshold: 50, text: '50x INFERNO!', color: '#ff1a1a' },
  { threshold: 25, text: '25x BLAZING!', color: '#ff4e00' },
  { threshold: 10, text: '10x COMBO!', color: '#ffd700' },
];
