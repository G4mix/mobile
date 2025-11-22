import React from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ScrollView, ActivityIndicator } from "react-native";
import { Header } from "@/components/Header";
import { Text, View } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";
import { ChatItem } from "../../../components/ChatsScreen/ChatItem";
import { useChats } from "@/hooks/useChats";
import { formatChatTime } from "@/utils/formatChatDate";

export default function ChatsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data, isLoading } = useChats(0, 10);

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
          {isLoading && (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator
                size="large"
                color={Colors.light.majorelleBlue}
              />
            </View>
          )}
          {!isLoading && data?.data && data.data.length === 0 && (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: Colors.light.russianViolet }}>
                Nenhuma conversa ainda
              </Text>
            </View>
          )}
          {!isLoading &&
            data?.data &&
            data.data.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const lastMessageDate = lastMessage
                ? formatChatTime(lastMessage.timestamp)
                : undefined;
              const lastMessageContent = lastMessage?.content;

              return (
                <ChatItem
                  key={chat.id}
                  id={chat.id}
                  displayName={chat.title}
                  icon={chat.image}
                  lastMessage={lastMessageContent}
                  date={lastMessageDate}
                  unreadMessages={0}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
