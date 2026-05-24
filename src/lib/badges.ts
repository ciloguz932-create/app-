export interface BadgeDef {
  key: string;
  emoji: string;
  title: string;
  description: string;
}

export const BADGE_DEFS: BadgeDef[] = [
  { key: "first_card",    emoji: "📚", title: "First Step",    description: "Study your first card" },
  { key: "cards_10",      emoji: "⭐", title: "Getting Started", description: "Study 10 cards total" },
  { key: "cards_50",      emoji: "🎓", title: "Scholar",        description: "Study 50 cards total" },
  { key: "cards_100",     emoji: "🏆", title: "Century",        description: "Study 100 cards total" },
  { key: "cards_500",     emoji: "💎", title: "Diamond",        description: "Study 500 cards total" },
  { key: "streak_3",      emoji: "🔥", title: "On Fire",        description: "3-day streak" },
  { key: "streak_7",      emoji: "⚡", title: "Week Warrior",   description: "7-day streak" },
  { key: "streak_30",     emoji: "🌟", title: "Unstoppable",    description: "30-day streak" },
  { key: "perfect",       emoji: "🎯", title: "Perfect Score",  description: "100% accuracy in a session" },
  { key: "level_5",       emoji: "🚀", title: "Rising Star",    description: "Reach level 5" },
  { key: "level_10",      emoji: "👑", title: "Master",         description: "Reach level 10" },
  { key: "night_owl",     emoji: "🦉", title: "Night Owl",      description: "Study after midnight" },
  { key: "early_bird",    emoji: "🐦", title: "Early Bird",     description: "Study before 7am" },
];

export const XP_REWARDS = {
  cardReviewed: 10,
  correctAnswer: 5,
  sessionComplete: 20,
  perfectSession: 50,
  streakBonus: (streak: number) => Math.min(streak * 3, 50),
};

export const LEVELS = [0, 100, 250, 500, 1000, 1800, 3000, 5000, 8000, 12000, 18000];

export function getLevel(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) return i + 1;
  }
  return 1;
}

export function xpToNextLevel(xp: number): { current: number; needed: number; level: number } {
  const level = getLevel(xp);
  const currentLevelXP = LEVELS[level - 1] ?? 0;
  const nextLevelXP = LEVELS[level] ?? LEVELS[LEVELS.length - 1];
  return { current: xp - currentLevelXP, needed: nextLevelXP - currentLevelXP, level };
}

export function checkBadges(params: {
  totalCards: number;
  streak: number;
  level: number;
  accuracy: number;
  hour: number;
  earnedKeys: string[];
}): string[] {
  const { totalCards, streak, level, accuracy, hour, earnedKeys } = params;
  const newBadges: string[] = [];
  const check = (key: string, condition: boolean) => {
    if (condition && !earnedKeys.includes(key) && !newBadges.includes(key)) newBadges.push(key);
  };
  check("first_card", totalCards >= 1);
  check("cards_10", totalCards >= 10);
  check("cards_50", totalCards >= 50);
  check("cards_100", totalCards >= 100);
  check("cards_500", totalCards >= 500);
  check("streak_3", streak >= 3);
  check("streak_7", streak >= 7);
  check("streak_30", streak >= 30);
  check("perfect", accuracy >= 100);
  check("level_5", level >= 5);
  check("level_10", level >= 10);
  check("night_owl", hour >= 0 && hour < 4);
  check("early_bird", hour >= 5 && hour < 7);
  return newBadges;
}
