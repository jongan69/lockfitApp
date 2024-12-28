import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ 
  title, 
  onPress, 
  disabled, 
  loading,
  variant = 'primary' 
}: ButtonProps) => {
  const { colors } = useTheme();  
  return (
    <TouchableOpacity
      style={{
        backgroundColor: variant === 'primary' ? colors.primary : 'transparent',
        borderColor: colors.primary,
        borderWidth: variant === 'secondary' ? 1 : 0,
      }}
      className={cn(
        "p-4 rounded-lg items-center my-2",
        disabled && "opacity-60"
      )}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.background} />
      ) : (
        <Text
          style={{
            color: variant === 'primary' ? colors.background : colors.primary,
          }}
          className="text-base font-semibold"
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}; 