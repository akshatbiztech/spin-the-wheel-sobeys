import React from "react";
import { Svg, Path } from "react-native-svg";

interface LogoutIconProps {
  color?: string;
  size?: number;
}

export const LogoutIcon: React.FC<LogoutIconProps> = ({
  color = "#ffffff",
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
      fill={color}
    />
  </Svg>
);
