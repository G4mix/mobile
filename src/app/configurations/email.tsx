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

export type UpdateEmailFormData = {
  email: string;
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

export default function EmailScreen() {
  const { user } = useSelector((state: RootState) => state.user);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { watch, setValue, handleSubmit } = useForm<UpdateEmailFormData>({
    defaultValues: {
      email: user.email || "",
    },
  });
  const updateUser = async ({ email }: UpdateEmailFormData) => {
    if (isLoading) return;
    if (user.email === email) {
      router.back();
      setIsLoading(false);
      return;
    }

    const formData = objectToFormData({
      user: { email },
    });

    const data = await handleRequest<
      UserState & { accessToken?: string; refreshToken?: string }
    >({
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
    if (data.accessToken && data.refreshToken) {
      await setItem("accessToken", data.accessToken);
      await setItem("refreshToken", data.refreshToken);
    }
    queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.back();
  };
  const onSubmit = handleSubmit(updateUser);
  const email = watch("email");
  return (
    <View style={styles.container}>
      {isSuccessVisible && <SuccessModal message="E-mail atualizado!" />}
      <Input
        placeholder={user.email || "Insira o seu e-mail"}
        label="E-mail Atual"
        labelColor={Colors.light.jet}
        color={Colors.light.jet}
        borderWidth={2}
        editable={false}
        value={user.email || ""}
      />
      <Input
        placeholder={user.email || "Insira o seu e-mail"}
        label="E-mail Novo"
        labelColor={Colors.light.russianViolet}
        color={Colors.light.tropicalIndigo}
        borderWidth={2}
        value={email}
        onChangeText={(value) => setValue("email", value)}
      />
      <Button onPress={onSubmit}>
        <Text style={{ color: Colors.light.white, fontSize: 16 }}>
          Atualizar
        </Text>
      </Button>
    </View>
  );
}
