import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useTheme } from '@/contexts/ThemeContext'
// import { Program } from '@/types/program'

const Programs = () => {
  const { currentProgram, setCurrentProgram } = useWorkoutStore()
  const { colors } = useTheme()

  // Temporary sample programs - you'll want to fetch these from your programService
  const samplePrograms = [
    {
      id: '1',
      name: 'Strength Builder',
      description: 'Build strength and muscle with compound exercises',
      duration: '12 weeks',
      difficulty: 'Intermediate'
    },
    {
      id: '2',
      name: 'HIIT Cardio',
      description: 'High-intensity interval training for fat loss',
      duration: '8 weeks',
      difficulty: 'Advanced'
    }
  ]

  const handleSelectProgram = (program: any) => {
    setCurrentProgram(program)
  }

  return (
    <ScrollView className="flex-1 bg-white" style={{ backgroundColor: colors.background }}>
      <View className="p-6">
        <Text className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
          Workout Programs
        </Text>
        
        <View className="space-y-6">
          {samplePrograms.map((program) => (
            <Pressable
              key={program.id}
              onPress={() => handleSelectProgram(program)}
              className={`p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm mb-4
                ${currentProgram?.id === program.id ? `border-2` : ''}
              `}
              style={currentProgram?.id === program.id ? { borderColor: colors.secondaryPrimary } : {}}
            >
              <Text className="text-xl font-semibold mb-3 text-gray-800 dark:text-white" style={{ color: colors.text }}>
                {program.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mb-4" style={{ color: colors.text }}>
                {program.description}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400" style={{ color: colors.text }}>
                  Duration: {program.duration}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400" style={{ color: colors.text }} >
                  Level: {program.difficulty}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default Programs