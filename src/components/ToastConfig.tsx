import { Linking } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { COLORS } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";

export const toastConfig = {
  success: (props: any) => {
    const { theme } = useTheme();
    
    return (
      <BaseToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: theme === 'dark' ? COLORS.WHITE : COLORS.GREY,
        }}
        text2Style={{
          fontSize: 14,
          color: theme === 'dark' ? COLORS.secondaryText : COLORS.GREY_2,
          marginTop: 4,
        }}
        text2NumberOfLines={10}
        style={{
          borderLeftColor: COLORS.GREEN,
          backgroundColor: theme === 'dark' ? COLORS.secondaryBackground : COLORS.WHITE,
          borderRadius: 8,
          paddingVertical: 16,
          paddingHorizontal: 12,
          height: 'auto',
          minHeight: 60,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          if (props.text2?.includes('solana.com')) {
            Linking.openURL(
              `https://explorer.solana.com/tx/${props.text2}?cluster=mainnet`
            );
          }
        }}
      />
    );
  },
  error: (props: any) => {
    const { theme } = useTheme();
    
    return (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: theme === 'dark' ? COLORS.WHITE : COLORS.GREY,
        }}
        text2Style={{
          fontSize: 14,
          color: theme === 'dark' ? COLORS.secondaryText : COLORS.GREY_2,
          marginTop: 4,
        }}
        text2NumberOfLines={10}
        style={{
          borderLeftColor: COLORS.RED,
          backgroundColor: theme === 'dark' ? COLORS.secondaryBackground : COLORS.WHITE,
          borderRadius: 8,
          paddingVertical: 16,
          paddingHorizontal: 12,
          height: 'auto',
          minHeight: 60,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      />
    );
  },
};