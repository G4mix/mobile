import { StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { Text, View } from "../Themed";
import { Button } from "../Button";
import { Colors } from "@/constants/colors";
import { styles as signupStyles } from "@/app/auth/signup";
import { ChangePasswordInputs } from "../ChangePasswordInputs";
import { handleRequest } from "@/utils/handleRequest";
import { setUser, UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";
import { setItem } from "@/constants/storage";
import { timeout } from "@/utils/timeout";
import { useToast } from "@/hooks/useToast";
import { SuccessModal } from "../SuccessModal";
import { SpinLoading } from "../SpinLoading";

const styles = StyleSheet.create({
  ...signupStyles,
  root: {
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
    width: "100%"
  }
});

type FormData = {
  confirmPassword: string;
  password: string;
};

export function ChangePassword() {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordValid, setIsPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      password: ""
    }
  });

  const changePassword = async ({ password: pwd }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.post("/auth/change-password", { password: pwd }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading,
      successMessage: "Senha alterada com sucesso!"
    });
    if (!data) return;
    dispatch(setUser(data.user));
    await setItem("user", JSON.stringify(data.user));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.push("/feed");
  };
  const onSubmit = handleSubmit(changePassword);

  useEffect(() => passwordRef.current?.focus(), []);

  return (
    <View style={styles.root}>
      {isLoading && <SpinLoading message="Alterando senha..." />}
      {isSuccessVisible && <SuccessModal message="Senha alterada!" />}
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
      <Button
        onPress={
          isPasswordValid === "valid" && isConfirmPasswordValid === "valid"
            ? onSubmit
            : undefined
        }
        disabled={
          !(isPasswordValid === "valid" && isConfirmPasswordValid === "valid")
        }
      >
        <Text style={{ color: Colors.light.background }}>Alterar senha</Text>
      </Button>
    </View>
  );
}
