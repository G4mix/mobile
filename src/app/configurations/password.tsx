import { View, StyleSheet, Text } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Colors } from "@/constants/colors";
import { setUser, UserState } from "@/features/auth/userSlice";
import { handleRequest } from "@/utils/handleRequest";
import { Button } from "@/components/Button";
import { useToast } from "@/hooks/useToast";
import { timeout } from "@/utils/timeout";
import { api } from "@/constants/api";
import { SuccessModal } from "@/components/SuccessModal";
import { ChangePasswordInputs } from "@/components/ChangePasswordInputs";
import { objectToFormData } from "@/utils/objectToFormData";
import { setItem } from "@/constants/storage";
import { RootState } from "@/constants/reduxStore";

export type UpdateUserPasswordFormData = {
  password: string;
  confirmPassword: string;
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

export default function PasswordScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const passwordRef = useRef<HTMLInputElement>(null);
  const { watch, setValue, handleSubmit } = useForm<UpdateUserPasswordFormData>(
    {
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    },
  );
  const updatePassword = async ({ password }: UpdateUserPasswordFormData) => {
    if (isLoading) return;

    const formData = objectToFormData({
      user: { password },
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
    router.push(`/configurations/account`);
  };
  const onSubmit = handleSubmit(updatePassword);
  return (
    <View style={styles.container}>
      {isSuccessVisible && <SuccessModal message="Senha atualizado!" />}
      <ChangePasswordInputs
        onSubmit={onSubmit}
        setValue={setValue as any}
        watch={watch as any}
        setIsConfirmPasswordValid={setIsConfirmPasswordValid}
        isConfirmPasswordValid={isConfirmPasswordValid}
        setIsPasswordValid={setIsPasswordValid}
        isPasswordValid={isPasswordValid}
        ref={passwordRef}
      />
      <Button onPress={onSubmit}>
        <Text style={{ color: Colors.light.white, fontSize: 16 }}>
          Atualizar
        </Text>
      </Button>
    </View>
  );
}
