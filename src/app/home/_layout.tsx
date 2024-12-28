import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Linking, View } from "react-native";
import { Link, useSegments, usePathname } from "expo-router";
import { Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/contexts/ThemeContext";
import { APP_HOMEPAGE } from "@/utils/constants";

// Define drawer items with icons for better visual hierarchy
const DRAWER_ITEMS = [
    { label: 'Home', href: '/home', icon: 'home-outline' },
    { label: 'Programs', href: '/home/programs', icon: 'barbell-outline' },
    { label: 'Progress', href: '/home/progress', icon: 'trending-up-outline' },
    { label: 'History', href: '/home/past', icon: 'time-outline' },
    { label: 'Rewards', href: '/home/rewards', icon: 'trophy-outline' },
    { label: 'Settings', href: '/home/settings', icon: 'settings-outline' },
] as const;

// Helper function for title formatting remains the same
const formatTitle = (title: string): string => {
    if (title === 'past') return 'History';
    return title.charAt(0).toUpperCase() + title.slice(1);
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const pathname = usePathname();
    const { colors } = useTheme();
    return (
        <DrawerContentScrollView 
            {...props} 
            className="flex p-0 w-full bg-black"
            contentContainerStyle={{
                paddingTop: 0
            }}
        >
            {/* Drawer Header */}
            <View className="py-12 px-6">
                <View className={`h-12 w-12 rounded-xl mb-4 items-center justify-center`}>
                    <Ionicons name="barbell" size={24} color={colors.secondaryPrimary} />
                </View>
                <Text style={{ color: colors.secondaryPrimary }} className="text-3xl font-bold">
                    Lockfit
                </Text>
                <Text style={{ color: colors.text }} className="text-sm mt-1.5">
                    Stay locked, stay fit
                </Text>
            </View>

            {/* Updated Drawer Items */}
            <View className="flex-1 bg-black">
                {DRAWER_ITEMS.map(({ label, href, icon }) => {
                    const isSelected = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            onPress={() => props.navigation.closeDrawer()}
                            className={`flex-row items-center px-4 py-3.5 ${
                                isSelected ? 'bg-white/10' : ''
                            }`}
                        >
                            <Ionicons 
                                name={icon as any} 
                                size={22} 
                                color={isSelected ? colors.secondaryPrimary : '#fff'}
                                className="mr-3"
                            />
                            <Text style={{ 
                                color: isSelected ? colors.secondaryPrimary : '#9ca3af'
                            }} className={`${
                                isSelected ? 'font-medium' : ''
                            }`}>
                                {label}
                            </Text>
                        </Link>
                    );
                })}
            </View>

            {/* Footer Section */}
            <View className="border-t border-gray-800 bg-black">
                <Link
                    href={APP_HOMEPAGE}
                    className="flex-row items-center px-4 py-3.5"
                    onPress={() => Linking.openURL(APP_HOMEPAGE)}
                >
                    <Ionicons name="globe-outline" size={22} color="#fff" className="mr-3" />
                    <Text className="text-gray-400">Visit Website</Text>
                </Link>
            </View>
        </DrawerContentScrollView>
    );
}

export default function Layout() {
    const segments = useSegments();
    const pathname = usePathname();

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTitle: ({ children }) => {
                    if (pathname === "/home") {
                        return <Text className="text-base font-medium text-white">Home</Text>;
                    }

                    const lastSegment = segments[segments.length - 1];
                    return <Text className="text-base font-medium text-white">
                        {formatTitle(lastSegment || 'Home')}
                    </Text>;
                },
                headerStyle: {
                    backgroundColor: '#000',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#222',
                },
                headerTintColor: '#fff',
                
                drawerStyle: {
                    backgroundColor: '#000',
                    
                }
            }}
        />
    );
}