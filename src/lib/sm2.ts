export interface SM2Card {
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface SM2Result extends SM2Card {
  dueDate: Date;
}

export function calculateSM2(card: SM2Card, quality: number): SM2Result {
  let { interval, easeFactor, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  dueDate.setHours(0, 0, 0, 0);

  return { interval, easeFactor, repetitions, dueDate };
}

export const QUALITY_LABELS = [
  { value: 0, label: "Again", color: "bg-red-500 hover:bg-red-600", description: "Complete blackout" },
  { value: 2, label: "Hard", color: "bg-orange-500 hover:bg-orange-600", description: "Incorrect but familiar" },
  { value: 4, label: "Good", color: "bg-emerald-500 hover:bg-emerald-600", description: "Correct with effort" },
  { value: 5, label: "Easy", color: "bg-blue-500 hover:bg-blue-600", description: "Perfect recall" },
];
