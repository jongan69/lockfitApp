import { useTheme } from '@/contexts/ThemeContext'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'

// Mock data for workout history
const mockWorkoutHistory = {
  '2024-03-10': {
    workout: {
      name: 'Upper Body Day',
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { weight: 60, reps: 12 },
            { weight: 70, reps: 10 },
            { weight: 75, reps: 8 }
          ]
        },
        {
          name: 'Pull-ups',
          sets: [
            { weight: 0, reps: 12 },
            { weight: 0, reps: 10 },
            { weight: 0, reps: 8 }
          ]
        }
      ]
    }
  },
  '2024-03-12': {
    workout: {
      name: 'Leg Day',
      exercises: [
        {
          name: 'Squats',
          sets: [
            { weight: 80, reps: 12 },
            { weight: 90, reps: 10 },
            { weight: 100, reps: 8 }
          ]
        },
        {
          name: 'Deadlifts',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 110, reps: 8 },
            { weight: 120, reps: 6 }
          ]
        }
      ]
    }
  }
}

const History = () => {
  const { colors } = useTheme()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  // Use mock data instead of real workout history
  const markedDates = Object.keys(mockWorkoutHistory).reduce<Record<string, { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string }>>((acc, date) => {
    acc[date] = { marked: true, dotColor: colors.primary }
    return acc
  }, {})

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      marked: true,
      selected: true,
      selectedColor: colors.primary,
    }
  }

  const calendarTheme = {
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.text,
    monthTextColor: colors.text,
    arrowColor: colors.primary,
  }

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString)
  }

  const jumpToToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setCurrentDate(today)
    setSelectedDate(today)
  }
  const renderExerciseDetails = (exercises: any[]) => {
    if (!exercises || exercises.length === 0) {
      return <Text style={[styles.text, { color: colors.text }]}>No exercises recorded for this workout.</Text>
    }

    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        {exercise.sets && exercise.sets.map((set: any, setIndex: number) => (
          <Text key={setIndex} style={[styles.setDetails, { color: colors.text }]}>
            Set {setIndex + 1}: {set.weight}kg × {set.reps} reps
          </Text>
        ))}
      </View>
    ))
  }

  const renderWorkouts = (date: string) => {
    const workoutForDate = mockWorkoutHistory[date] // Use mock data here
    if (!workoutForDate || !workoutForDate.workout) {
      return <Text style={[styles.text, { color: colors.text }]}>No workouts found for this date.</Text>
    }

    const workout = workoutForDate.workout
    return (
      <View style={[styles.workoutCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.workoutTitle, { color: colors.text }]}>{workout.name || 'Unknown Workout'}</Text>
        {renderExerciseDetails(workout.exercises || [])}
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.todayButton, { backgroundColor: colors.primary }]} 
          onPress={jumpToToday}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        current={currentDate}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={calendarTheme}
      />
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={[styles.workoutDate, { color: colors.text }]}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          {renderWorkouts(selectedDate)}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  todayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  selectedDateContainer: {
    marginTop: 20,
  },
  workoutDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  setDetails: {
    fontSize: 14,
    marginLeft: 8,
  },
  text: {
    fontSize: 14,
  },
})

export default History