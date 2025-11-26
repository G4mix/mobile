import React from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { setActualTab as setProfileTab } from "@/features/profile/profileSlice";
import { setActualTab as setProjectsTab } from "@/features/projects/projectsSlice";
import { setActualTab as setFeedTab } from "@/features/feed/feedSlice";

const styles = StyleSheet.create({
  actualTab: {
    borderBottomColor: Colors.light.majorelleBlue,
    borderBottomWidth: 3,
  },
  contentTabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: Dimensions.get("screen").width >= 350 ? 24 : 12,
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
    width: "100%",
  },
});

export type Tab<T extends string = "feed"> = {
  name: string;
  key: T extends "feed"
    ? "following" | "recommendations" | "highlights"
    : T extends "profile"
      ? "ideas" | "about"
      : T extends "project"
        ? "ideas" | "about"
        : undefined;
  disabled?: boolean;
};

export function ContentTabs({
  tabs,
  tabType,
  contentTabStyles = {},
}: {
  tabs: Tab<any>[];
  tabType: "feed" | "profile" | "project";
  contentTabStyles?: StyleProp<ViewStyle>;
}) {
  const stateKey = tabType === "project" ? "projects" : tabType;
  const actualTab = useSelector((state: any) => {
    const tabState = state[stateKey];
    if (!tabState || !tabState.actualTab) {
      return tabType === "project"
        ? "ideas"
        : tabType === "profile"
          ? "ideas"
          : "recommendations";
    }
    return tabState.actualTab;
  });
  const dispatch = useDispatch();

  const handlePress = (key: Tab<any>["key"]) => {
    if (tabType === "profile") {
      dispatch(setProfileTab(key));
    } else if (tabType === "project") {
      dispatch(setProjectsTab(key));
    } else if (tabType === "feed") {
      dispatch(setFeedTab(key));
    }
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
            disabled ? { opacity: 0.7 } : {},
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
              fontSize: actualTab === key ? 16 : 13.33,
            }}
          >
            {name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
