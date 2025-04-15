import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Icon, IconName } from "./Icon";
import { Text } from "./Themed";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    gap: 16,
    width: "100%"
  },
  optionsRoot: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 62,
    elevation: 10,
    flexDirection: "column",
    gap: 12,
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    right: 0,
    shadowColor: Colors.dark.background,
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 20
  }
});

type FloatingOptionsProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  options: {
    name: string;
    iconName: IconName;
    onPress: (props: any) => void;
  }[];
  optionProps: any;
};

export function FloatingOptions({
  isVisible,
  setIsVisible,
  options,
  optionProps
}: FloatingOptionsProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.optionsRoot}>
              {options.map(({ name, onPress, iconName }) => (
                <TouchableOpacity
                  key={`floating-option-${name}`}
                  onPress={() => {
                    onPress(optionProps);
                    setIsVisible(false); // fecha ao clicar na opção
                  }}
                  style={styles.option}
                >
                  <Icon
                    name={iconName}
                    color={Colors.light.majorelleBlue}
                    size={24}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text
                    style={{
                      color: Colors.light.majorelleBlue,
                      fontWeight: "600",
                      fontSize: 16
                    }}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
