import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useWorkoutStore } from '@/store/workoutStore';
import { StrongLifts5x5Program } from '@/services/programService';

const HomeScreen = () => {
  const { currentProgram, startWorkout, setCurrentProgram } = useWorkoutStore();
  
  const todaysWorkout = currentProgram?.workouts?.workoutA;

  const handleStartWorkout = () => {
    if (todaysWorkout) {
      startWorkout(todaysWorkout);
      router.replace('/workout/active');
    }
  };

  const handleSelectProgram = () => {
    setCurrentProgram(StrongLifts5x5Program);
  };

  return (
    <ScrollView className="flex-1 bg-neutral-800">
      <View className="p-5">
        <Text className="text-2xl text-white font-bold mb-5">StrongLifts 5x5</Text>

        {/* Today's Workout Section */}
        {todaysWorkout ? (
          <View className="bg-neutral-700 rounded-lg p-4 mb-5">
            <Text className="text-xl text-white font-semibold mb-3">Today's Workout</Text>
            {todaysWorkout.exercises.map((exercise) => (
              <View key={exercise.id} className="mb-2">
                <Text className="text-white">
                  {exercise.name}: {exercise.targetSets}x{exercise.targetReps} @ {exercise.sets[0].weight}lbs
                </Text>
              </View>
            ))}
            <TouchableOpacity 
              className="bg-blue-500 rounded-lg p-3 mt-3" 
              onPress={handleStartWorkout}
            >
              <Text className="text-white text-center font-semibold">Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-neutral-700 rounded-lg p-4 mb-5">
            <Text className="text-white text-center">Select a program to get started</Text>
          </View>
        )}

        {/* Programs Section */}
        <Text className="text-xl text-white font-semibold mb-3">Programs</Text>
        <View className="space-y-3">
          <TouchableOpacity 
            className="bg-neutral-700 rounded-lg p-4"
            onPress={handleSelectProgram}
          >
            <Text className="text-white font-semibold">StrongLifts 5x5 (Beginner)</Text>
            <Text className="text-neutral-400 text-sm">The classic 5x5 program for beginners</Text>
            {currentProgram?.id === 'sl5x5' && (
              <Text className="text-green-500 text-sm mt-1">Currently Selected</Text>
            )}
          </TouchableOpacity>
          <View className="py-2"/>
          {/* These could be enabled later with more program options */}
          <TouchableOpacity className="bg-neutral-700/50 rounded-lg p-4">
            <Text className="text-white/50 font-semibold">StrongLifts 5x5 (Intermediate)</Text>
            <Text className="text-neutral-400/50 text-sm">Advanced progression for plateaus</Text>
            <Text className="text-blue-500/50 text-sm mt-1">Coming Soon</Text>
          </TouchableOpacity>
          <View className="py-2"/>
          <TouchableOpacity className="bg-neutral-700/50 rounded-lg p-4">
            <Text className="text-white/50 font-semibold">Madcow 5x5</Text>
            <Text className="text-neutral-400/50 text-sm">Intermediate strength building program</Text>
            <Text className="text-blue-500/50 text-sm mt-1">Coming Soon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;