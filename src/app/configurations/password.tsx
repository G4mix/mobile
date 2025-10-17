import { View, StyleSheet, Text } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { handleRequest } from "@/utils/handleRequest";
import { Button } from "@/components/Button";
import { useToast } from "@/hooks/useToast";
import { timeout } from "@/utils/timeout";
import { api } from "@/constants/api";
import { SuccessModal } from "@/components/SuccessModal";
import { ChangePasswordInputs } from "@/components/ChangePasswordInputs";

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
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const { showToast } = useToast();
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

    const data = await handleRequest<UserState>({
      requestFn: async () =>
        api.post(
          "/auth/change-password",
          { password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      showToast,
      setIsLoading,
    });
    if (!data) return;
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
