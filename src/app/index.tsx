import { View } from "react-native";
import LoginScreen from "./LoginScreen";
import { useEffect } from "react";
import { router, usePathname } from "expo-router";
import { useWallet } from "@/contexts/WalletContext";
import Toast from "react-native-toast-message";


export default function Index() {
  const { isAuthenticated, publicKey } = useWallet();

  useEffect(() => {
    console.log('=== Index Debug ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('publicKey:', publicKey);
    if (isAuthenticated) {
      router.push("/home/(root)")
    }
    if (!isAuthenticated && !publicKey) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You are not logged in.",
      });
    };
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}
