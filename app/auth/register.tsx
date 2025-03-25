import { Image, StyleSheet, Text } from "react-native";
import { useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { View } from "@/components/Themed";
import { Input } from "@/components/Input";
import {
  isValidEmail,
  isValidPassword,
  isValidPasswordLength,
  isValidPasswordNumber,
  isValidPasswordSpecialChar,
  isValidPasswordUppercase,
  isValidUsername
} from "@/constants/validations";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Colors } from "@/constants/colors";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { handleRequest } from "@/utils/handleRequest";
import { setUser, UserState } from "@/features/auth/userSlice";
import { setItem } from "@/constants/storage";
import favIcon from "@/assets/images/favicon.png";
import { Icon } from "@/components/Icon";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    overflowY: "auto",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  },
  passwordRequirements: {
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    gap: 4,
    padding: 12,
    width: "100%"
  },
  requirement: {
    borderColor: Colors.light.jet,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    gap: 4,
    minWidth: "40%",
    padding: 4
  },
  requirementInvalid: {
    borderColor: Colors.light.red
  },
  requirementValid: {
    borderColor: Colors.light.green
  },
  requirementsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "100%"
  },
  termsContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function RegisterScreen() {
  const [isUsernameValid, setIsUsernameValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isEmailValid, setIsEmailValid] = useState<"valid" | "invalid" | null>(
    null
  );
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isChecked, setIsChecked] = useState(false);

  const [isPasswordValid, setIsPasswordValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordSpecialCharValid, setIsPasswordSpecialCharValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordNumberValid, setIsPasswordNumberValid] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isPasswordUppercaseValid, setIsPasswordUppercaseValid] = useState<
    "valid" | "invalid" | null
  >(null);

  const [isRequirementsVisible, setIsRequirementsVisible] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidEmailPhrase, setInvalidEmailPhrase] = useState<
    string | undefined
  >(undefined);

  const { showToast } = useToast();

  const dispatch = useDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line no-undef
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      password: "",
      email: "",
      username: ""
    }
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const findByEmail = async ({ email }: { email: string }) => {
    if (isLoadingUser) return;
    // eslint-disable-next-line consistent-return
    return handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.get(`/user/exists/${email}`, { skipAuth: true } as any),
      showToast,
      setIsLoading: setIsLoadingUser,
      ignoreErrors: true
    });
  };

  const register = async ({ username, password: pwd, email }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.post("/auth/signup", { username, password: pwd, email }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading,
      successMessage: "Registro concluído com sucesso!"
    });
    if (!data) return;
    dispatch(setUser(data.user));
    await setItem("user", JSON.stringify(data.user));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    router.replace("/application/feed");
  };

  const onSubmit = handleSubmit(register);

  const readyToRegister =
    isUsernameValid === "valid" &&
    isEmailValid === "valid" &&
    isPasswordValid === "valid" &&
    isConfirmPasswordValid === "valid" &&
    isChecked;

  const handleFocus = () => {
    setIsRequirementsVisible(true);
  };

  const handleBlur = () => {
    setIsRequirementsVisible(false);
  };

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

  const validatePasswordConfirm = (value?: string, actualPassword?: string) => {
    if (value) setValue("confirmPassword", value);
    const pwd = actualPassword || password;
    const cp = value || confirmPassword;
    if (pwd.length === 0 || cp.length === 0) {
      setIsConfirmPasswordValid(null);
    } else if (pwd === cp) {
      setIsConfirmPasswordValid("valid");
    } else {
      setIsConfirmPasswordValid("invalid");
    }
  };

  const validatePassword = (value: string) => {
    setValue("password", value);
    validatePasswordConfirm(undefined, value);
    setIsPasswordValid(isValidPassword(value));
    setIsPasswordLengthValid(isValidPasswordLength(value));
    setIsPasswordSpecialCharValid(isValidPasswordSpecialChar(value));
    setIsPasswordNumberValid(isValidPasswordNumber(value));
    setIsPasswordUppercaseValid(isValidPasswordUppercase(value));
  };

  const requirements = [
    { condition: isPasswordLengthValid, text: "6 caracteres" },
    { condition: isPasswordSpecialCharValid, text: "1 caractere especial" },
    { condition: isPasswordNumberValid, text: "1 número" },
    { condition: isPasswordUppercaseValid, text: "1 caractere maiúsculo" }
  ];

  return (
    <View style={styles.container}>
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
      <Input
        icon="lock"
        label="Senha"
        isPasswordInput
        onChangeText={validatePassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Digite uma senha"
        isValid={isPasswordValid}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        ref={passwordRef}
        returnKeyType="next"
      />
      {isRequirementsVisible && (
        <View style={styles.passwordRequirements}>
          <Text style={{ color: Colors.light.russianViolet }}>
            A senha deve conter no mínimo:
          </Text>
          <View style={styles.requirementsContainer}>
            {requirements.map(({ condition, text }) => (
              <View
                style={[
                  styles.requirement,
                  condition === "valid" ? styles.requirementValid : {},
                  condition === "invalid" ? styles.requirementInvalid : {}
                ]}
                key={text}
              >
                {condition === "valid" && (
                  <Icon name="check" size={20} color="green" />
                )}
                {condition === "invalid" && (
                  <Icon name="x" size={20} color="red" />
                )}
                <Text
                  style={{
                    color:
                      condition === "valid"
                        ? Colors.light.green
                        : condition === "invalid"
                          ? Colors.light.red
                          : Colors.light.jet
                  }}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <Input
        icon="lock"
        label="Confirme a senha"
        isPasswordInput
        onChangeText={validatePasswordConfirm}
        invalidPhrase="As senhas não são iguais"
        placeholder="Digite sua senha novamente"
        isValid={isConfirmPasswordValid}
        onSubmitEditing={onSubmit}
        ref={confirmPasswordRef}
        returnKeyType="done"
      />
      <View style={styles.termsContainer}>
        <Checkbox isChecked={isChecked} setIsChecked={setIsChecked} />
        <Text style={{ flex: 1, wordWrap: "break-word", textAlign: "justify" }}>
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
        <Text>Registrar-se</Text>
      </Button>
      <Link href="/">
        <Text style={{ color: Colors.light.russianViolet }}>
          Já tem uma conta?
        </Text>
        <Text style={{ color: Colors.light.tropicalIndigo }}> Entrar</Text>
      </Link>
    </View>
  );
}
