/**
 * Season utility functions for NFL season management
 * 
 * NFL seasons span calendar years (e.g., 2024-2025 season)
 * - Regular season: August - December (current calendar year)
 * - Playoffs: January - February (following calendar year, but part of previous season)
 */

/**
 * Get the current NFL season year
 * @returns {number} The NFL season year
 */
export function getCurrentNFLSeason(): number {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = now.getFullYear();
  
  // NFL season logic:
  // January (1) - February (2): Previous year's season
  // March (3) - July (7): Off-season, use current year for upcoming season
  // August (8) - December (12): Current year's season
  
  if (currentMonth <= 2) {
    // Jan-Feb: This is playoffs of previous year's season
    return currentYear - 1;
  } else {
    // Mar-Dec: Current year's season (including off-season prep)
    return currentYear;
  }
}

/**
 * Check if a given date falls within NFL preseason
 * @param {Date} date - The date to check
 * @param {number} season - The NFL season year
 * @returns {boolean} True if date is in preseason
 */
export function isPreseason(date: Date = new Date(), season: number = getCurrentNFLSeason()): boolean {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Preseason typically runs August through early September
  return (year === season && month === 8) || 
         (year === season && month === 9 && date.getDate() <= 10);
}

/**
 * Check if a given date falls within the NFL regular season
 * @param {Date} date - The date to check
 * @param {number} season - The NFL season year
 * @returns {boolean} True if date is in regular season
 */
export function isRegularSeason(date: Date = new Date(), season: number = getCurrentNFLSeason()): boolean {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Regular season typically runs mid-September through December/early January
  return (year === season && month >= 9 && month <= 12 && !(month === 9 && date.getDate() <= 10)) ||
         (year === season + 1 && month === 1 && date.getDate() <= 7);
}

/**
 * Check if a given date falls within NFL playoffs
 * @param {Date} date - The date to check
 * @param {number} season - The NFL season year
 * @returns {boolean} True if date is in playoffs
 */
export function isPlayoffs(date: Date = new Date(), season: number = getCurrentNFLSeason()): boolean {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Playoffs run mid-January through February of the year AFTER the season year
  return (year === season + 1 && month === 1 && date.getDate() > 7) ||
         (year === season + 1 && month === 2);
}

/**
 * Get the current season type (preseason, regular, playoffs, offseason)
 * @param {Date} date - The date to check
 * @param {number} season - The NFL season year
 * @returns {string} The season type
 */
export function getSeasonType(date: Date = new Date(), season: number = getCurrentNFLSeason()): 'preseason' | 'regular' | 'playoffs' | 'offseason' {
  if (isPreseason(date, season)) {
    return 'preseason';
  } else if (isRegularSeason(date, season)) {
    return 'regular';
  } else if (isPlayoffs(date, season)) {
    return 'playoffs';
  } else {
    return 'offseason';
  }
}