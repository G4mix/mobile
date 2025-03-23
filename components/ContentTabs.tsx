import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";

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

type Tab = {
  name: string;
  key: "following" | "recommendations" | "highlights";
};

export function ContentTabs() {
  const [actualTab, setActualTab] = useState<Tab["key"]>("recommendations");
  const tabs: Tab[] = [
    {
      name: "Destaques",
      key: "following"
    },
    {
      name: "Recomendações",
      key: "recommendations"
    },
    {
      name: "Seguindo",
      key: "highlights"
    }
  ];

  const handlePress = (key: Tab["key"]) => {
    setActualTab(key);
  };

  return (
    <View style={styles.contentTabList}>
      {tabs.map(({ key, name }) => (
        <Pressable
          key={`content-tab-${name}`}
          style={[
            styles.contentTabItem,
            actualTab === key ? styles.actualTab : {}
          ]}
          onPress={() => handlePress(key)}
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
