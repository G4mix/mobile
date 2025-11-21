import React from "react";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Notification } from "../../../components/Notification";
import { Header } from "@/components/Header";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={{ flex: 1 }}>
      <Header
        options={{}}
        title="Notificações"
        route={route}
        navigation={navigation as any}
      />
      <ScrollView style={{ backgroundColor: Colors.light.background }}>
        <View style={{ padding: 16, gap: 12 }}>
          <Notification
            date="Ontem"
            displayName="Lorem"
            ideaName="Albion Online"
          />
        </View>
      </ScrollView>
      <View
        style={{
          position: "fixed",
          bottom: 62,
          minWidth: "100%",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <Button
          style={{
            backgroundColor: Colors.light.background,
            borderRadius: 8,
            padding: 16,
            minWidth: "auto",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: Colors.dark.russianViolet,
            }}
          >
            Limpar tudo
          </Text>
        </Button>
      </View>
    </View>
  );
}
