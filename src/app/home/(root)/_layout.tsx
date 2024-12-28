import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { Platform } from 'react-native';

export default function Layout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background + 'CC',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0.5,
                    shadowOffset: {
                        width: 0,
                        height: -1,
                    },
                    shadowRadius: 20,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
                    paddingTop: 8,
                    height: Platform.OS === 'ios' ? 85 : 65,
                    borderTopColor: 'transparent',
                    shadowColor: colors.primary + '40',
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text + '40',
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '800',
                    letterSpacing: 0.8,
                    marginTop: 3,
                    textTransform: 'uppercase',
                },
                tabBarIconStyle: {
                    marginTop: 4,
                    transform: [{scale: 1.1}],
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="programs"
                options={{
                    title: 'Programs',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="past"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="history" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-line" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Rewards',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="gift" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}