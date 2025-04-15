import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { setActualTab } from "@/features/feed/feedSlice";

const styles = StyleSheet.create({
  actualTab: {
    borderBottomColor: Colors.light.majorelleBlue,
    borderBottomWidth: 3
  },
  contentTabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24
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

export type Tab = {
  name: string;
  key: "following" | "recommendations" | "highlights";
  disabled?: boolean;
};

export function ContentTabs() {
  const actualTab = useSelector((state: any) => state.feed.actualTab);
  const dispatch = useDispatch();

  const tabs: Tab[] = [
    {
      name: "Destaques",
      disabled: true,
      key: "following"
    },
    {
      name: "Recomendações",
      key: "recommendations"
    },
    {
      name: "Seguindo",
      disabled: true,
      key: "highlights"
    }
  ];

  const handlePress = (key: Tab["key"]) => {
    dispatch(setActualTab(key));
  };

  return (
    <View style={styles.contentTabList}>
      {tabs.map(({ key, name, disabled }) => (
        <Pressable
          key={`content-tab-${name}`}
          style={[
            styles.contentTabItem,
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
