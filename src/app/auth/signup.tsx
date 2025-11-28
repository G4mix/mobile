import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { View } from "@/components/Themed";
import { Input } from "@/components/Input";
import { isValidEmail, isValidUsername } from "@/constants/validations";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Colors } from "@/constants/colors";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { handleRequest } from "@/utils/handleRequest";
import { setUser, UserState } from "@/features/auth/userSlice";
import { setItem } from "@/constants/storage";
import favIcon from "@/assets/images/favicon.png";
import { SpinLoading } from "@/components/SpinLoading";
import { timeout } from "@/utils/timeout";
import { SuccessModal } from "@/components/SuccessModal";
import { ChangePasswordInputs } from "@/components/ChangePasswordInputs";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    overflowY: "auto",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  termsContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default function RegisterScreen() {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const [isUsernameValid, setIsUsernameValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isEmailValid, setIsEmailValid] = useState<"valid" | "invalid" | null>(
    null,
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordValid, setIsPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidEmailPhrase, setInvalidEmailPhrase] = useState<
    string | undefined
  >(undefined);

  const { showToast } = useToast();

  const dispatch = useDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line no-undef
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      password: "",
      email: "",
      username: "",
    },
  });

  const findByEmail = async ({ email }: { email: string }) => {
    if (isLoadingUser) await timeout();

    return handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.get(`/user/exists/${email}`, { skipAuth: true } as any),
      showToast,
      setIsLoading: setIsLoadingUser,
      ignoreErrors: true,
    });
  };

  const register = async ({ username, password: pwd, email }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      userProfile: UserState;
    }>({
      requestFn: async () =>
        api.post("/auth/signup", { username, password: pwd, email }, {
          skipAuth: true,
        } as any),
      showToast,
      setIsLoading,
      successMessage: "Registro concluído com sucesso!",
    });
    if (!data) return;
    dispatch(setUser(data.userProfile));
    await setItem("user", JSON.stringify(data.userProfile));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.push("/feed");
  };

  const onSubmit = handleSubmit(register);

  const readyToRegister =
    isUsernameValid === "valid" &&
    isEmailValid === "valid" &&
    isPasswordValid === "valid" &&
    isConfirmPasswordValid === "valid" &&
    isChecked;

  const validateUsername = (value: string) => {
    setIsUsernameValid(isValidUsername(value));
    setValue("username", value);
  };

  const validateEmail = (value: string) => {
    setValue("email", value);

    const validated = isValidEmail(value);
    if (validated !== "valid") {
      setIsEmailValid(validated);
      setInvalidEmailPhrase(undefined);
      return;
    }

    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }

    emailTimeoutRef.current = setTimeout(async () => {
      const foundedEmail = await findByEmail({ email: value });
      if (foundedEmail) {
        setIsEmailValid("invalid");
        setInvalidEmailPhrase("E-mail já está em uso!");
      } else {
        setIsEmailValid("valid");
      }
      emailTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {isLoading && <SpinLoading message="Registrando-se..." />}
        {isSuccessVisible && <SuccessModal message="Conta criada!" />}
        <Image source={favIcon} style={{ maxWidth: 120, maxHeight: 120 }} />
        <Text style={styles.title}>Criar uma conta</Text>
        <Input
          icon="user"
          label="Nome de Usuário"
          isPasswordInput={false}
          placeholder="Digite seu nome de usuário aqui"
          onChangeText={validateUsername}
          isValid={isUsernameValid}
          onSubmitEditing={() => emailRef.current?.focus()}
          returnKeyType="next"
        />
        <Input
          icon="envelope"
          label="E-mail"
          isPasswordInput={false}
          placeholder="Digite seu e-mail aqui"
          invalidPhrase={invalidEmailPhrase}
          onChangeText={validateEmail}
          isValid={isEmailValid}
          onSubmitEditing={() => passwordRef.current?.focus()}
          ref={emailRef}
          returnKeyType="next"
        />
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
        <View style={styles.termsContainer}>
          <Checkbox isChecked={isChecked} setIsChecked={setIsChecked} />
          <Text
            style={{ flex: 1, wordWrap: "break-word", textAlign: "justify" }}
          >
            Eu li e concordo com os{" "}
            <Link
              asChild
              href="/terms"
              style={{ color: Colors.light.majorelleBlue }}
            >
              <Text>termos e política de privacidade</Text>
            </Link>
          </Text>
        </View>
        <Button
          onPress={readyToRegister && !isLoading ? onSubmit : undefined}
          disabled={!readyToRegister || isLoading}
        >
          <Text style={{ color: Colors.light.background }}>Registrar-se</Text>
        </Button>
        <Link href="/auth/signin">
          <Text style={{ color: Colors.light.russianViolet }}>
            Já tem uma conta?
          </Text>
          <Text style={{ color: Colors.light.tropicalIndigo }}> Entrar</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
