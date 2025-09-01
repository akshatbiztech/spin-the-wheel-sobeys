import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Svg, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// SVG Icons
const HomeIcon = ({ color = "#ffffff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"
      fill={color}
    />
  </Svg>
);

const HistoryIcon = ({ color = "#ffffff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill={color}
    />
  </Svg>
);

const ProfileIcon = ({ color = "#ffffff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill={color}
    />
  </Svg>
);

const ExampleIcon = ({ color = "#ffffff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
    />
  </Svg>
);

interface TabItem {
  name: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
}

const tabs: TabItem[] = [
  {
    name: "History",
    icon: HistoryIcon,
    label: "History",
  },
  {
    name: "Home",
    icon: HomeIcon,
    label: "Home",
  },
  {
    name: "Example",
    icon: ExampleIcon,
    label: "Example",
  },
  {
    name: "Profile",
    icon: ProfileIcon,
    label: "Profile",
  },
];

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const highlightPosition = React.useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = React.useState(0);
  const iconScales = React.useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  React.useEffect(() => {
    Animated.spring(highlightPosition, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.index]);

  const getIcon = (routeName: string) => {
    const tab = tabs.find((tab) => tab.name === routeName);
    return tab?.icon || HomeIcon;
  };

  const getLabel = (routeName: string) => {
    const tab = tabs.find((tab) => tab.name === routeName);
    return tab?.label || routeName;
  };

  return (
    <View
      style={{
        backgroundColor: "#7c3aed",
        paddingTop: 16,
        paddingBottom: Math.max(insets.bottom, 16),
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          height: 80,
          alignItems: "center",
        }}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setTabWidth(width / state.routes.length);
        }}
      >
        {/* Animated Highlight Background */}
        <Animated.View
          style={{
            position: "absolute",
            top: 8,
            bottom: 8,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            transform: [
              {
                translateX: highlightPosition.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: [0, tabWidth, tabWidth * 2, tabWidth * 3],
                }),
              },
            ],
            width: tabWidth - 16,
            left: 8,
          }}
        />

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = getLabel(route.name);
          const IconComponent = getIcon(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            // Add scale animation on press
            Animated.sequence([
              Animated.timing(iconScales[index], {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(iconScales[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
                zIndex: 1,
              }}
            >
              <Animated.View
                style={{
                  transform: [{ scale: iconScales[index] }],
                }}
              >
                <IconComponent
                  color={isFocused ? "#7c3aed" : "#ffffff"}
                  size={24}
                />
              </Animated.View>
              <Text
                style={{
                  color: isFocused ? "#7c3aed" : "#ffffff",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
