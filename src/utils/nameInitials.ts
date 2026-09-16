/**
 * Utility to extract patient name initials (first letter of each word).
 * e.g., "Kim, Sun-hee" -> "KS"
 *       "Park, Mi-ja"  -> "PM"
 *       "Lee, Jung-ho" -> "LJ"
 *       "James Wilson" -> "JW"
 */
export const getPatientInitials = (name: string): string => {
  if (!name) return 'PT';
  
  // Clean punctuation like commas, periods, quotes
  const clean = name.replace(/[,."'`]/g, ' ').trim();
  // Split words by whitespace or hyphens
  const words = clean.split(/[\s-]+/).filter(w => w.trim().length > 0);
  
  if (words.length === 0) return 'PT';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  
  // First letter of each word (up to 2 letters for clean avatar presentation)
  return (words[0][0] + words[1][0]).toUpperCase();
};
