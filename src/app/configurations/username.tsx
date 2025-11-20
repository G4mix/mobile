import { View, StyleSheet, Text } from "react-native";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/Input";
import { Colors } from "@/constants/colors";
import { setUser, UserState } from "@/features/auth/userSlice";
import { handleRequest } from "@/utils/handleRequest";
import { Button } from "@/components/Button";
import { RootState } from "@/constants/reduxStore";
import { useToast } from "@/hooks/useToast";
import { objectToFormData } from "@/utils/objectToFormData";
import { setItem } from "@/constants/storage";
import { timeout } from "@/utils/timeout";
import { api } from "@/constants/api";
import { SuccessModal } from "@/components/SuccessModal";

export type UpdateUsernameFormData = {
  username: string;
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    overflowY: "auto",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
});

export default function UsernameScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { watch, setValue, handleSubmit } = useForm<UpdateUsernameFormData>({
    defaultValues: {
      username: user.user.username || "",
    },
  });
  const updateUser = async ({ username }: UpdateUsernameFormData) => {
    if (isLoading) return;
    if (user.user.username === username) {
      router.back();
      setIsLoading(false);
      return;
    }

    const formData = objectToFormData({
      username,
    });

    const data = await handleRequest<UserState>({
      requestFn: async () =>
        api.patch("/user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      showToast,
      setIsLoading,
    });
    if (!data) return;

    await setItem("user", JSON.stringify(data));
    dispatch(setUser(data));
    queryClient.setQueryData(["user", user.id], data);
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.push(`/configurations/account`);
  };
  const onSubmit = handleSubmit(updateUser);
  const username = watch("username");
  return (
    <View style={styles.container}>
      {isSuccessVisible && (
        <SuccessModal message="Nome de usuário atualizado!" />
      )}
      <Input
        placeholder={
          user.user.username || "Como quer que as pessoas te chamem?"
        }
        label="Nome de Usuário Atual"
        labelColor={Colors.light.jet}
        color={Colors.light.jet}
        borderWidth={2}
        editable={false}
        value={username}
      />
      <Input
        placeholder={
          user.user.username || "Como quer que as pessoas te chamem?"
        }
        label="Nome de Usuário Novo"
        labelColor={Colors.light.russianViolet}
        color={Colors.light.tropicalIndigo}
        borderWidth={2}
        value={username}
        onChangeText={(value) => setValue("username", value)}
      />
      <Button onPress={onSubmit}>
        <Text style={{ color: Colors.light.white, fontSize: 16 }}>
          Atualizar
        </Text>
      </Button>
    </View>
  );
}
