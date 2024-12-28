export interface Set {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: number;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  completed?: boolean;
  date?: string;
}

export interface WorkoutHistory {
  date: string;
  workout: Workout;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  workouts: {
    workoutA: Workout;
    workoutB: Workout;
  };
  progression: {
    initialWeights: { [key: string]: number };
    incrementAmount: { [key: string]: number };
  };
} 