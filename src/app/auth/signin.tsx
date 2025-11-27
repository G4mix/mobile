import { Image, StyleSheet, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Colors } from "@/constants/colors";
import { handleRequest } from "@/utils/handleRequest";
import { setUser, UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { setItem } from "@/constants/storage";
import { OAuthLogin } from "@/features/auth/OAuthLogin";
import favIcon from "@/assets/images/favicon.png";
import { SpinLoading } from "@/components/SpinLoading";

type FormData = {
  password: string;
  email: string;
};

const styles = StyleSheet.create({
  connectionMethodsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 32,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  passwordContainer: {
    display: "flex",
    gap: 4,
    width: "100%",
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default function LoginScreen() {
  const providers = ["google", "linkedin", "github"];

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = async ({ password, email }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      userProfile: UserState;
    }>({
      requestFn: async () =>
        api.post("/auth/signin", { password, email }, {
          skipAuth: true,
        } as any),
      showToast,
      setIsLoading,
    });
    if (!data) return;

    dispatch(setUser(data.userProfile));
    await setItem("user", JSON.stringify(data.userProfile));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    router.replace("/feed");
  };

  const onSubmit = handleSubmit(login);
  const email = watch("email");
  const password = watch("password");
  const isReadyToLogin = email.length > 0 && password.length > 0;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {isLoading && <SpinLoading message="Conectando-se..." />}
        <View
          style={{
            backgroundColor: "#ff0000",
            padding: 10,
            width: "100%",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            API URL: {process.env.EXPO_PUBLIC_API_URL || "VAZIO"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            GitHub ID: {process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || "VAZIO"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            Google ID: {process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "VAZIO"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            LinkedIn ID: {process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || "VAZIO"}
          </Text>
        </View>
        <Image source={favIcon} style={{ maxWidth: 120, maxHeight: 120 }} />
        <Text style={styles.title}>Entrar</Text>
        <View style={styles.connectionMethodsContainer}>
          {providers.map((provider) => (
            <OAuthLogin
              provider={provider as any}
              key={`handle-login-with-${provider}`}
              disabled
            />
          ))}
        </View>
        <Text style={{ color: Colors.dark.background, fontWeight: "medium" }}>
          OU
        </Text>
        <Input
          icon="envelope"
          label="E-mail"
          isPasswordInput={false}
          placeholder="Digite seu e-mail aqui"
          onChangeText={(value: string) => setValue("email", value)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          returnKeyType="next"
        />
        <View style={styles.passwordContainer}>
          <Input
            icon="lock-closed"
            label="Senha"
            isPasswordInput
            placeholder="Digite a sua senha"
            onChangeText={(value: string) => setValue("password", value)}
            onSubmitEditing={
              isReadyToLogin && !isLoading ? onSubmit : undefined
            }
            returnKeyType="done"
            ref={passwordRef}
          />
          <Link href="/auth/forget-password" disabled>
            <Text style={{ color: Colors.light.tropicalIndigo, opacity: 0.7 }}>
              Esqueci minha senha
            </Text>
          </Link>
        </View>
        <Button
          onPress={isReadyToLogin && !isLoading ? onSubmit : undefined}
          disabled={!isReadyToLogin || isLoading}
        >
          <Text style={{ color: Colors.light.white }}>Conectar-se</Text>
        </Button>
        <Link href="/auth/signup">
          <Text style={{ color: Colors.light.russianViolet }}>
            Ainda não tem uma conta?
          </Text>
          <Text style={{ color: Colors.light.tropicalIndigo }}>
            {" "}
            Criar conta
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
