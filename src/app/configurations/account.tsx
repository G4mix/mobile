import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Option } from "@/components/ConfigurationsScreen/Option";
import { Colors } from "@/constants/colors";
import { api } from "@/constants/api";
import { UserState } from "@/features/auth/userSlice";
import { RootState } from "@/constants/reduxStore";

export default function AccountScreen() {
  const user = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", user.userProfile.id],
    queryFn: async () => {
      const response = await api.get<UserState>(`/user/${user.userProfile.id}`);
      return response.data;
    },
    enabled: !!user.userProfile.id
  });
  if (isError) router.push("/configurations");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16
        }}
      >
        {isLoading && !data && <Text>Carregando...</Text>}
          {!isLoading && data && (
            <View>
              <Option
                position="start"
                name={`${data.username}`}
                icon="user"
                onPress={() => router.push("/configurations/username")}
              />
              <Option
                position="middle"
                name={`${data.email}`}
                icon="envelope"
                onPress={() => router.push("/configurations/email")}
              />
              <Option
                position="end"
                name="************"
                icon="lock-closed"
                onPress={() => router.push("/configurations/password")}
              />

            </View>
          )}
      </View>
    </ScrollView>
  );
}
