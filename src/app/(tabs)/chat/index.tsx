import React from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ScrollView } from "react-native";
import { Header } from "@/components/Header";
import { Text, View } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";
import { ChatItem } from "../../../components/ChatsScreen/ChatItem";

export default function ChatsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={{ flex: 1 }}>
      <Header
        options={{}}
        title="Chat"
        route={route}
        navigation={navigation as any}
      />
      <ScrollView style={{ backgroundColor: Colors.light.background }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24, gap: 12 }}>
          <View
            style={{
              gap: 16,
              padding: 24,
              borderBottomColor: Colors.light.majorelleBlue,
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: 700,
                color: Colors.light.russianViolet,
                fontSize: 19.2,
              }}
            >
              Comece a Conversar!
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: 400,
                color: Colors.light.russianViolet,
                fontSize: 16,
              }}
            >
              Este é o seu espaço para se conectar com os usuários.
            </Text>
          </View>
          <ChatItem
            displayName="Lorem"
            id="1521-51512"
            lastMessage="Teste: Lorem ipson"
            date="12:45"
            unreadMessages={120}
          />
          <ChatItem displayName="Lorem" id="1521-51512" unreadMessages={0} />
          <ChatItem displayName="Lorem" id="1521-51512" unreadMessages={0} />
        </View>
      </ScrollView>
    </View>
  );
}
