import React, { useRef } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { CartesianChart, Line } from 'victory-native'
import { Circle } from "@shopify/react-native-skia";

// Mock data
const MOCK_EXERCISE_PROGRESS = [
  {
    name: 'Squat',
    pr: 315,
    data: [225, 245, 275, 295, 315]
  },
  {
    name: 'Bench Press',
    pr: 225,
    data: [135, 155, 185, 205, 225]
  },
  {
    name: 'Deadlift',
    pr: 405,
    data: [315, 335, 365, 385, 405]
  }
];

type ChartData = {
  x: number;
  y: number;
};

const Progress = () => {
  const { colors } = useTheme();
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  const bigThreeExercises = ['Squat', 'Bench Press', 'Deadlift'];
  
  const totalBigThree = MOCK_EXERCISE_PROGRESS
    .filter(e => bigThreeExercises.includes(e.name))
    .reduce((sum, e) => sum + e.pr, 0);

  // Transform data for charts
  const getCombinedData = (): ChartData[] => {
    return MOCK_EXERCISE_PROGRESS
      .filter(e => bigThreeExercises.includes(e.name))
      .reduce<ChartData[]>((acc, exercise) => {
        exercise.data.forEach((value, index) => {
          acc.push({ x: index, y: (acc[index]?.y || 0) + value });
        });
        return acc;
      }, []);
  };

  const getExerciseData = (data: number[]): ChartData[] => {
    return data.map((value, index) => ({ x: index, y: value }));
  };

  const chartConfig = {
    grid: {
      stroke: colors.border,
      strokeOpacity: 0.1,
    },
    axis: {
      stroke: colors.border,
      strokeWidth: 1,
    },
    ticks: {
      stroke: colors.text,
      strokeOpacity: 0.2,
      length: 4,
    },
  };

  return (
    <ScrollView 
      className="flex-1 px-4 py-6"
      style={{ backgroundColor: colors.background }}
      ref={scrollViewRef}
      scrollEventThrottle={16}
    >
      <View className="rounded-3xl p-6 mb-6 shadow-xl" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-semibold text-text mb-1" style={{ color: colors.text }}>Total</Text>
        <Text className="text-4xl font-bold text-primary mb-6" style={{ color: colors.primary }}>{totalBigThree} lbs</Text>
        <View style={{ height: 220 }}>
          <CartesianChart
            data={getCombinedData()}
            xKey="x"
            yKeys={["y"]}
            axisOptions={{
              font: undefined,
              formatXLabel: (value) => `${value + 1}`,
              formatYLabel: (value) => `${value}`,
              ...chartConfig
            }}
            domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
          >
            {({ points }) => (
              <>
                <Line 
                  points={points.y} 
                  color={colors.primary} 
                  strokeWidth={3}
                  curveType="monotoneX"
                />
                {points.y.map((point, index) => (
                  <Circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    style="fill"
                    color={colors.primary}
                  />
                ))}
              </>
            )}
          </CartesianChart>
        </View>
      </View>

      {MOCK_EXERCISE_PROGRESS
        .filter(e => bigThreeExercises.includes(e.name))
        .map(exercise => (
          <View key={exercise.name} className="rounded-2xl p-5 mb-4 shadow-lg" style={{ backgroundColor: colors.card }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-text" style={{ color: colors.text }}>{exercise.name}</Text>
              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}1A` }}>
                <Text className="text-base font-bold text-primary" style={{ color: colors.primary }}>{exercise.pr} lbs</Text>
              </View>
            </View>
            <View style={{ height: 120 }}>
              <CartesianChart
                data={getExerciseData(exercise.data)}
                xKey="x"
                yKeys={["y"]}
                axisOptions={{
                  font: undefined,
                  formatXLabel: (value) => `${value + 1}`,
                  formatYLabel: (value) => `${value}`,
                  ...chartConfig
                }}
                domainPadding={{ left: 10, right: 10, top: 10, bottom: 10 }}
              >
                {({ points }) => (
                  <>
                    <Line 
                      points={points.y} 
                      color={colors.primary} 
                      strokeWidth={2}
                      curveType="monotoneX"
                    />
                    {points.y.map((point, index) => (
                      <Circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        style="fill"
                        color={colors.primary}
                      />
                    ))}
                  </>
                )}
              </CartesianChart>
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

export default Progress;