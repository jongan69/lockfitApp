import { Program, Workout } from '../types/workout';

const createWorkout = (name: string, exercises: Array<{ name: string; weight: number }>): Workout => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  exercises: exercises.map(ex => ({
    id: Math.random().toString(36).substr(2, 9),
    name: ex.name,
    targetSets: 5,
    targetReps: 5,
    sets: Array(5).fill({
      weight: ex.weight,
      reps: 5,
      completed: false
    })
  }))
});

export const StrongLifts5x5Program: Program = {
  id: 'sl5x5',
  name: 'StrongLifts 5x5',
  description: 'The classic 5x5 program for beginners',
  workouts: {
    workoutA: createWorkout('Workout A', [
      { name: 'Squat', weight: 45 },
      { name: 'Bench Press', weight: 45 },
      { name: 'Barbell Row', weight: 45 }
    ]),
    workoutB: createWorkout('Workout B', [
      { name: 'Squat', weight: 45 },
      { name: 'Overhead Press', weight: 45 },
      { name: 'Deadlift', weight: 95 }
    ])
  },
  progression: {
    initialWeights: {
      'Squat': 45,
      'Bench Press': 45,
      'Barbell Row': 45,
      'Overhead Press': 45,
      'Deadlift': 95
    },
    incrementAmount: {
      'Squat': 5,
      'Bench Press': 5,
      'Barbell Row': 5,
      'Overhead Press': 5,
      'Deadlift': 10
    }
  }
};

export const getNextWorkout = (lastWorkout: Workout | null): Workout => {
  // Logic to alternate between workout A and B
  if (!lastWorkout || lastWorkout.name === 'Workout B') {
    return StrongLifts5x5Program.workouts.workoutA;
  }
  return StrongLifts5x5Program.workouts.workoutB;
}; 