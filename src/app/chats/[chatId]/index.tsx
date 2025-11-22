import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { View } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";
import { ChatMessage } from "../../../components/ChatsScreen/ChatMessage";
import { DateSeparator } from "../../../components/ChatsScreen/DateSeparator";
import { ChatInput } from "../../../components/ChatsScreen/ChatInput";
import { ChatHeader } from "../../../components/ChatsScreen/ChatHeader";
import background from "@/assets/images/BackgroundChat.png";


export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={background}
      style={{
        flex: 1
    }}>
      <ChatHeader
        icon={null}
        displayName="Lorem Ipsum"
        options={{}}
        route={route}
        navigation={navigation as any}
      />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 12,
            backgroundColor: "transparent",
            paddingBottom: 100,
          }}
        >
          <DateSeparator date="26/10/2025" />
          <ChatMessage
            date="23:58"
            isActualUser={false}
            message="Lorem Ipsum"
          />
          <ChatMessage date="23:59" isActualUser message="Lorem Ipsum" />
        </View>
      </ScrollView>
      <ChatInput />
    </ImageBackground>
  );
}
