import React, { useEffect, useRef, ReactNode } from "react";
import {
  View,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from "react-native";

type LoadingProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function Loading({
  width = 200,
  height = 20,
  borderRadius = 8,
  style,
  children,
}: LoadingProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#2b2b2b",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          backgroundColor: "#434343",
          transform: [{ translateX }],
          borderRadius,
        }}
      />
      {children}
    </View>
  );
}
