import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses = "rounded-xl items-center justify-center";

  const variantClasses = {
    primary: "bg-primary-500 active:bg-primary-600",
    secondary: "bg-secondary-500 active:bg-secondary-600",
    danger: "bg-red-500 active:bg-red-600",
    outline: "bg-transparent border-2 border-primary-500",
  };

  const sizeClasses = {
    sm: "py-2 px-4",
    md: "py-3 px-6",
    lg: "py-4 px-8",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const textClasses = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    danger: "text-white font-semibold",
    outline: "text-primary-500 font-semibold",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      <Text className={`${textClasses[variant]} ${textSizeClasses[size]}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
