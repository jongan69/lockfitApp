import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    FadeInUp,
    FadeOut,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

interface Reward {
    id: string;
    title: string;
    description: string;
    requiredWorkouts: number;
    tokenReward: number;
    claimed: boolean;
}

const RewardCard = ({ reward, progress, onClaim }: {
    reward: Reward;
    progress: number;
    onClaim: () => void;
}) => {
    const { completedWorkouts } = useWorkoutStore();
    const { colors } = useTheme();
    const progressPercentage = Math.min((completedWorkouts / reward.requiredWorkouts) * 100, 100);

    return (
        <Animated.View
            entering={FadeInUp}
            style={{ backgroundColor: colors.card }}
            className="rounded-xl p-4 m-2 shadow-md"
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-lg font-bold">
                        {reward.title}
                    </Text>
                    <Text style={{ color: colors.secondaryText }} className="mt-1">
                        {reward.description}
                    </Text>
                </View>
                <View style={{ backgroundColor: colors.secondaryBackground }} className="rounded-full p-3">
                    <MaterialCommunityIcons name="trophy-award" size={24} color={colors.primary} />
                </View>
            </View>

            {/* Progress Bar */}
            <View style={{ backgroundColor: colors.border }} className="h-2 rounded-full mt-4">
                <View
                    style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: colors.primary 
                    }}
                    className="h-full rounded-full"
                />
            </View>

            <View className="flex-row justify-between items-center mt-2">
                <Text style={{ color: colors.secondaryText }} className="text-sm">
                    {progress}/{reward.requiredWorkouts} workouts
                </Text>
                <Text style={{ color: colors.primary }} className="text-sm font-semibold">
                    {reward.tokenReward} tokens
                </Text>
            </View>

            {progress >= reward.requiredWorkouts && !reward.claimed && (
                <Pressable
                    onPress={onClaim}
                    style={{ backgroundColor: colors.primary }}
                    className="rounded-lg py-2 px-4 mt-3"
                >
                    <Text style={{ color: colors.buttonText }} className="text-center font-semibold">
                        Claim Reward
                    </Text>
                </Pressable>
            )}

            {reward.claimed && (
                <View style={{ backgroundColor: colors.success }} className="rounded-lg py-2 px-4 mt-3">
                    <Text style={{ color: colors.successText }} className="text-center font-semibold">
                        Claimed!
                    </Text>
                </View>
            )}
        </Animated.View>
    );
};

const Rewards = () => {
    const { colors } = useTheme();
    const { completedWorkouts } = useWorkoutStore();
    const [rewards, setRewards] = useState<Reward[]>([
        {
            id: '1',
            title: 'Workout Warrior',
            description: 'Complete 5 workouts',
            requiredWorkouts: 5,
            tokenReward: 50,
            claimed: false,
        },
        {
            id: '2',
            title: 'Fitness Enthusiast',
            description: 'Complete 15 workouts',
            requiredWorkouts: 15,
            tokenReward: 150,
            claimed: false,
        },
        {
            id: '3',
            title: 'Exercise Master',
            description: 'Complete 30 workouts',
            requiredWorkouts: 30,
            tokenReward: 300,
            claimed: false,
        },
    ]);

    const handleClaim = (rewardId: string) => {
        setRewards(rewards.map(reward =>
            reward.id === rewardId ? { ...reward, claimed: true } : reward
        ));
        // Here you would typically call your wallet service to transfer tokens
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className={`p-6 ${colors.primary}`}>
                <Text className="text-2xl font-bold text-white">Rewards</Text>
                <Text className="text-purple-100 mt-1">
                    Complete workouts to earn tokens!
                </Text>
            </View>

            {/* Progress Overview */}
            <View className="bg-white dark:bg-gray-800 mx-4 mt-4 p-4 rounded-xl shadow-sm">
                <Text className="text-lg font-semibold dark:text-white">
                    Your Progress
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mt-1">
                    {completedWorkouts} workouts completed
                </Text>
            </View>

            {/* Rewards List */}
            <View className="p-2">
                {rewards.map((reward) => (
                    <RewardCard
                        key={reward.id}
                        reward={reward}
                        progress={completedWorkouts}
                        onClaim={() => handleClaim(reward.id)}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

export default Rewards;      