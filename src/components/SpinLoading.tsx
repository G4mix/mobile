import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, Modal } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";

const CIRCLE_COUNT = 8;
const ANIMATION_DURATION = 1200;
const MAX_RADIUS = 40;
const MAX_SCALE = 1.2;
const MIN_SCALE = 0.6;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 50,
    height: 16,
    position: "absolute",
    width: 16
  },
  container: {
    alignItems: "center",
    height: 100,
    justifyContent: "center",
    position: "fixed",
    width: "100%"
  },
  root: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    position: "fixed",
    width: "100%",
    zIndex: 9999
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export function SpinLoading({
  message = "Carregando..."
}: {
  message?: string;
}) {
  const fadeAnimations = useRef(
    Array.from({ length: CIRCLE_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    fadeAnimations.forEach((anim, i) => {
      setTimeout(
        () => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1, // Mais visível
                duration: ANIMATION_DURATION * 0.4,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
              }),
              Animated.timing(anim, {
                toValue: 0.3, // Menos visível
                duration: ANIMATION_DURATION * 0.6,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
              })
            ])
          ).start();
        },
        (ANIMATION_DURATION / CIRCLE_COUNT) * i
      );
    });
  }, [fadeAnimations]);

  return (
    <Modal style={{ flex: 1 }}>
      <View style={styles.root}>
        <View style={styles.container}>
          {fadeAnimations.map((anim, i) => {
            const angle = (360 / CIRCLE_COUNT) * i;
            const radius = MAX_RADIUS;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            const scale = anim.interpolate({
              inputRange: [0.3, 1],
              outputRange: [MIN_SCALE, MAX_SCALE] // Menor quando menos visível, maior quando mais visível
            });

            return (
              <Animated.View
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={[
                  styles.circle,
                  {
                    opacity: anim,
                    transform: [
                      { translateX: x },
                      { translateY: y },
                      { scale } // Anima o tamanho sem erro do Native Driver
                    ]
                  }
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.title}>{message}</Text>
      </View>
    </Modal>
  );
}
