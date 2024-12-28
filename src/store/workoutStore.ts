import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Exercise, Program, Workout, WorkoutHistory } from '../types/workout';
import { router } from 'expo-router';

const isAsyncStorageAvailable = AsyncStorage !== null;

interface WorkoutState {
  currentProgram: Program | null;
  currentWorkout: Workout | null;
  workoutHistory: WorkoutHistory[];
  exerciseProgress: { [key: string]: number }; // Tracks PR for each exercise
  completedWorkouts: number;
  
  // Actions
  setCurrentProgram: (program: Program) => void;
  startWorkout: (workout: Workout) => void;
  completeSet: (exerciseIndex: number, setIndex: number, reps: number) => void;
  completeWorkout: () => void;
  updateExerciseProgress: (exerciseName: string, weight: number) => void;
}

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    if (!isAsyncStorageAvailable) {
      console.warn('AsyncStorage is not available, using memory storage');
      return null;
    }
    try {
      return await AsyncStorage.getItem(name);
    } catch (err) {
      console.error('Error loading from AsyncStorage:', err);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!isAsyncStorageAvailable) {
      console.warn('AsyncStorage is not available, using memory storage');
      return;
    }
    try {
      await AsyncStorage.setItem(name, value);
    } catch (err) {
      console.error('Error saving to AsyncStorage:', err);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (!isAsyncStorageAvailable) {
      console.warn('AsyncStorage is not available, using memory storage');
      return;
    }
    try {
      await AsyncStorage.removeItem(name);
    } catch (err) {
      console.error('Error removing from AsyncStorage:', err);
    }
  },
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentProgram: null,
      currentWorkout: null,
      workoutHistory: [],
      exerciseProgress: {},
      completedWorkouts: 0,

      setCurrentProgram: (program) => set({ currentProgram: program }),
      
      startWorkout: (workout) => set({ currentWorkout: workout }),
      
      completeSet: (exerciseIndex, setIndex, reps) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const newWorkout = { ...workout };
        const exercise = newWorkout.exercises[exerciseIndex];
        exercise.sets[setIndex] = {
          ...exercise.sets[setIndex],
          reps,
          completed: true,
        };

        set({ currentWorkout: newWorkout });
      },

      completeWorkout: () => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const history = [...get().workoutHistory];
        history.push({
          date: new Date().toISOString(),
          workout: { ...workout, completed: true },
        });

        // Update PRs
        workout.exercises.forEach((exercise) => {
          const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
          get().updateExerciseProgress(exercise.name, maxWeight);
        });

        set({
          workoutHistory: history,
          currentWorkout: null,
        });
        router.replace('/home/(root)');
      },

      updateExerciseProgress: (exerciseName, weight) => {
        const progress = get().exerciseProgress;
        const currentPR = progress[exerciseName] || 0;
        
        if (weight > currentPR) {
          set({
            exerciseProgress: {
              ...progress,
              [exerciseName]: weight,
            },
          });
        }
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => storage),
    }
  )
); 