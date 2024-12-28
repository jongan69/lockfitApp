import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useWorkoutStore } from '../../store/workoutStore';
import { router } from 'expo-router';

const ActiveWorkout = () => {
  const { currentWorkout, completeSet, completeWorkout } = useWorkoutStore();
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [setReps, setSetReps] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev ? prev - 1 : null);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer]);

  if (!currentWorkout) {
    return (
      <View className="flex bg-neutral-900 p-5 justify-center items-center">
        <Text className="text-white text-2xl font-bold mb-2">No Active Workout</Text>
        <Text className="text-neutral-400 text-center mb-6">Start a workout from your programs list</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-8 py-4 rounded-xl active:bg-blue-600"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const setKey = `${exerciseIndex}-${setIndex}`;
    const exercise = currentWorkout.exercises[exerciseIndex];
    const currentReps = setReps[setKey] || exercise.targetReps;

    if (!currentWorkout.exercises[exerciseIndex].sets[setIndex].completed) {
      // First tap - mark as complete
      completeSet(exerciseIndex, setIndex, currentReps);
      setRestTimer(180); // 3 minute rest timer
    } else {
      // Subsequent taps - decrement reps
      const newReps = Math.max(0, currentReps - 1);
      setSetReps(prev => ({ ...prev, [setKey]: newReps }));
      completeSet(exerciseIndex, setIndex, newReps);
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-900">
      <View className="p-5 py-20">
        <Text className="text-3xl text-white font-bold mb-2">
          {currentWorkout.name}
        </Text>
        <Text className="text-neutral-400 mb-6">Keep pushing yourself! 💪</Text>

        {restTimer && restTimer > 0 && (
          <View className="bg-blue-500/20 border border-blue-500 p-6 rounded-2xl mb-6">
            <Text className="text-blue-400 text-center text-lg mb-1">Rest Timer</Text>
            <Text className="text-white text-center text-4xl font-bold">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}

        {currentWorkout.exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id} className="bg-neutral-800 rounded-2xl p-6 mb-5 border border-neutral-700">
            <Text className="text-2xl text-white font-bold mb-2">
              {exercise.name}
            </Text>
            
            <Text className="text-neutral-400 mb-4">
              Target: {exercise.targetSets} sets × {exercise.targetReps} reps @ {exercise.sets[0].weight}lbs
            </Text>
            
            <View className="flex-row flex-wrap gap-3">
              {exercise.sets.map((set, setIndex) => {
                const setKey = `${exerciseIndex}-${setIndex}`;
                const currentReps = setReps[setKey] || exercise.targetReps;
                
                return (
                  <TouchableOpacity
                    key={setIndex}
                    className={`w-16 h-16 rounded-2xl justify-center items-center
                      ${set.completed ? 'bg-green-500/20 border-2 border-green-500' : 'bg-blue-500/20 border-2 border-blue-500'}`}
                    onPress={() => handleSetComplete(exerciseIndex, setIndex)}
                  >
                    <Text className={`text-xl font-bold ${set.completed ? 'text-green-400' : 'text-blue-400'}`}>
                      {currentReps}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="bg-green-500 p-5 rounded-2xl mt-4 mb-8 active:bg-green-600"
          onPress={completeWorkout}
        >
          <Text className="text-white text-center font-bold text-xl">
            Complete Workout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 

export default ActiveWorkout;