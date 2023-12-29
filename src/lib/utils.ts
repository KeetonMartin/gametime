import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define a type for the team keys
type TeamKey = 'ARI' | 'Arizona Cardinals' | 'ATL' | 'Atlanta Falcons' | 'BAL' | 'Baltimore Ravens' | 'BUF' | 'Buffalo Bills' | 'CAR' | 'Carolina Panthers' | 'CHI' | 'Chicago Bears' | 'CIN' | 'Cincinnati Bengals' | 'CLE' | 'Cleveland Browns' | 'DAL' | 'Dallas Cowboys' | 'DEN' | 'Denver Broncos' | 'DET' | 'Detroit Lions' | 'GB' | 'Green Bay Packers' | 'HOU' | 'Houston Texans' | 'IND' | 'Indianapolis Colts' | 'JAX' | 'Jacksonville Jaguars' | 'KC' | 'Kansas City Chiefs' | 'LAC' | 'Los Angeles Chargers' | 'LAR' | 'Los Angeles Rams' | 'MIA' | 'Miami Dolphins' | 'MIN' | 'Minnesota Vikings' | 'NE' | 'New England Patriots' | 'NO' | 'New Orleans Saints' | 'NYG' | 'New York Giants' | 'NYJ' | 'New York Jets' | 'OAK' | 'Las Vegas Raiders' | 'PHI' | 'Philadelphia Eagles' | 'PIT' | 'Pittsburgh Steelers' | 'SF' | 'San Francisco 49ers' | 'SEA' | 'Seattle Seahawks' | 'TB' | 'Tampa Bay Buccaneers' | 'TEN' | 'Tennessee Titans' | 'WAS' | 'Washington Commanders';

// Helper function to determine background color based on NFL team
export const getTeamBackgroundColor = (team: string | undefined) => {
  const teamColors: { [key in TeamKey]?: string } = {
    'ARI': 'bg-red-200', // Arizona Cardinals
    'Arizona Cardinals': 'bg-red-200',
    'ATL': 'bg-slate-200', // Atlanta Falcons
    'Atlanta Falcons': 'bg-slate-200',
    'BAL': 'bg-purple-200', // Baltimore Ravens
    'Baltimore Ravens': 'bg-purple-200',
    'BUF': 'bg-blue-200', // Buffalo Bills
    'Buffalo Bills': 'bg-blue-200',
    'CAR': 'bg-blue-200', // Carolina Panthers
    'Carolina Panthers': 'bg-blue-200',
    'CHI': 'bg-cyan-200', // Chicago Bears
    'Chicago Bears': 'bg-cyan-200',
    'CIN': 'bg-orange-200', // Cincinnati Bengals
    'Cincinnati Bengals': 'bg-orange-200',
    'CLE': 'bg-[#dcc0ab]', // Cleveland Browns
    'Cleveland Browns': 'bg-[#dcc0ab]',
    'DAL': 'bg-blue-200', // Dallas Cowboys
    'Dallas Cowboys': 'bg-blue-200',
    'DEN': 'bg-orange-200', // Denver Broncos
    'Denver Broncos': 'bg-orange-200',
    'DET': 'bg-blue-200', // Detroit Lions
    'Detroit Lions': 'bg-blue-200',
    'GB': 'bg-green-200', // Green Bay Packers
    'Green Bay Packers': 'bg-green-200',
    'HOU': 'bg-blue-200', // Houston Texans
    'Houston Texans': 'bg-blue-200',
    'IND': 'bg-blue-200', // Indianapolis Colts
    'Indianapolis Colts': 'bg-blue-200',
    'JAX': 'bg-teal-200', // Jacksonville Jaguars
    'Jacksonville Jaguars': 'bg-teal-200',
    'KC': 'bg-red-200', // Kansas City Chiefs
    'Kansas City Chiefs': 'bg-red-200',
    'LAC': 'bg-blue-200', // Los Angeles Chargers
    'Los Angeles Chargers': 'bg-blue-200',
    'LAR': 'bg-blue-200', // Los Angeles Rams
    'Los Angeles Rams': 'bg-blue-200',
    'MIA': 'bg-teal-200', // Miami Dolphins
    'Miami Dolphins': 'bg-teal-200',
    'MIN': 'bg-purple-200', // Minnesota Vikings
    'Minnesota Vikings': 'bg-purple-200',
    'NE': 'bg-blue-200', // New England Patriots
    'New England Patriots': 'bg-blue-200',
    'NO': 'bg-amber-200', // New Orleans Saints
    'New Orleans Saints': 'bg-amber-200',
    'NYG': 'bg-blue-200', // New York Giants
    'New York Giants': 'bg-blue-200',
    'NYJ': 'bg-emerald-200', // New York Jets
    'New York Jets': 'bg-emerald-200',
    'OAK': 'bg-slate-200', // Las Vegas Raiders (formerly Oakland)
    'Las Vegas Raiders': 'bg-slate-200',
    'PHI': 'bg-green-200', // Philadelphia Eagles
    'Philadelphia Eagles': 'bg-green-200',
    'PIT': 'bg-slate-200', // Pittsburgh Steelers
    'Pittsburgh Steelers': 'bg-slate-200',
    'SF': 'bg-red-200', // San Francisco 49ers
    'San Francisco 49ers': 'bg-red-200',
    'SEA': 'bg-blue-200', // Seattle Seahawks
    'Seattle Seahawks': 'bg-blue-200',
    'TB': 'bg-red-200', // Tampa Bay Buccaneers
    'Tampa Bay Buccaneers': 'bg-red-200',
    'TEN': 'bg-blue-200', // Tennessee Titans
    'Tennessee Titans': 'bg-blue-200',
    'WAS': 'bg-red-200', // Washington Commanders (formerly Redskins)
    'Washington Commanders': 'bg-red-200'
  };

  return teamColors[team as TeamKey] || 'bg-gray-200';
};