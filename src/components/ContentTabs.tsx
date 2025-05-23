import React from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { setActualTab } from "@/features/profile/profileSlice";

const styles = StyleSheet.create({
  actualTab: {
    borderBottomColor: Colors.light.majorelleBlue,
    borderBottomWidth: 3
  },
  contentTabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: Dimensions.get("screen").width >= 350 ? 24 : 12
  },
  contentTabList: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: Colors.light.russianViolet,
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%"
  }
});

export type Tab<T extends string = "feed"> = {
  name: string;
  key: T extends "feed"
    ? "following" | "recommendations" | "highlights"
    : T extends "profile"
      ? "posts" | "about"
      : undefined;
  disabled?: boolean;
};

export function ContentTabs({
  tabs,
  tabType,
  contentTabStyles = {}
}: {
  tabs: Tab<any>[];
  tabType: "feed" | "profile";
  contentTabStyles?: StyleProp<ViewStyle>;
}) {
  const actualTab = useSelector((state: any) => state[tabType].actualTab);
  const dispatch = useDispatch();

  const handlePress = (key: Tab<any>["key"]) => {
    dispatch(setActualTab(key));
  };

  return (
    <View style={styles.contentTabList}>
      {tabs.map(({ key, name, disabled }) => (
        <Pressable
          key={`content-tab-${name}`}
          style={[
            styles.contentTabItem,
            contentTabStyles,
            actualTab === key ? styles.actualTab : {},
            disabled ? { opacity: 0.7 } : {}
          ]}
          onPress={disabled ? undefined : () => handlePress(key)}
        >
          <Text
            style={{
              color:
                actualTab === key
                  ? Colors.light.majorelleBlue
                  : Colors.light.russianViolet,
              fontWeight: "medium",
              fontSize: actualTab === key ? 16 : 13.33
            }}
          >
            {name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
