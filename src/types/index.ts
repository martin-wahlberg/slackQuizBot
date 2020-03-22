interface User {
  addedBy: string;
  userName: string;
}

interface Day {
  dateTime?: number;
  points: number;
  bonus: number;
}

interface Week {
  days: Record<string, Day>;
  weekNumber: number;
  totalPoints?: number;
  totalBonus?: number;
  totalCombined?: number;
}

interface Streak {
  points: number;
  numberOfDays: number;
}

interface ScoreFormInput {
  bonus: { bonus: { value: string } };
  legitimate: { legitimate: { value: string } };
}
