import { Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import favIcon from "@/assets/images/favicon.png";
import { SendRecoverEmail } from "@/components/ForgetPasswordScreen/SendRecoverEmail";
import { InsertCode } from "@/components/ForgetPasswordScreen/InsertCode";
import { ChangePassword } from "@/components/ForgetPasswordScreen/ChangePassword";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { SpinLoading } from "@/components/SpinLoading";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default function ForgetPasswordScreen() {
  const [actualStep, setActualStep] = useState(0);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const steps = [SendRecoverEmail, InsertCode, ChangePassword];
  const ActualStep = steps[actualStep];
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const incrementStep = () => {
    setActualStep((prevValue) => (prevValue === 2 ? prevValue : prevValue + 1));
  };

  const resetSteps = () => {
    setActualStep(0);
  };

  const changePassword = async (
    {
      email: e,
    }: {
      email: string;
    },
    increment: boolean,
  ) => {
    if (isLoading) return;
    const data = await handleRequest<{ email: string }>({
      requestFn: async () =>
        api.post("/auth/send-recover-email", { email: e }, {
          skipAuth: true,
        } as any),
      showToast,
      setIsLoading,
      successMessage: "E-mail de recuperação enviado com sucesso!",
    });
    if (!data) return;
    if (increment) {
      setEmail(data.email);
      incrementStep();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <SpinLoading message="Enviando e-mail de recuperação..." />}
      <Image source={favIcon} style={{ maxWidth: 120, maxHeight: 120 }} />
      <Text style={styles.title}>Recupere sua conta</Text>
      <ActualStep
        incrementStep={incrementStep}
        resetSteps={resetSteps}
        email={email}
        setToken={setToken}
        token={token}
        changePassword={changePassword}
      />
      <Link href="/auth/signin">
        <Text style={{ color: Colors.light.russianViolet }}>
          Lembrou sua senha?
        </Text>
        <Text style={{ color: Colors.light.tropicalIndigo }}> Entrar</Text>
      </Link>
    </View>
  );
}
