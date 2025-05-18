import { StyleSheet } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "../Themed";
import { Input } from "../Input";
import { Colors } from "@/constants/colors";
import { Button } from "../Button";
import { isValidEmail } from "@/constants/validations";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { SpinLoading } from "../SpinLoading";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
    width: "100%"
  }
});

type SendRecoverEmailProps = {
  incrementStep: () => void;
  setEmail: Dispatch<SetStateAction<string>>;
};

type FormData = {
  email: string;
};

export function SendRecoverEmail({
  incrementStep,
  setEmail
}: SendRecoverEmailProps) {
  const [isEmailValid, setIsEmailValid] = useState<"valid" | "invalid" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: ""
    }
  });

  const changePassword = async ({ email }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{ email: string }>({
      requestFn: async () =>
        api.post("/auth/send-recover-email", { email }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading,
      successMessage: "E-mail de recuperação enviado com sucesso!"
    });
    if (!data) return;
    setEmail(data.email);
    setValue("email", "");
    incrementStep();
  };
  const onSubmit = handleSubmit(changePassword);

  const email = watch("email");

  const validateEmail = (value: string) => {
    setValue("email", value);
    setIsEmailValid(isValidEmail(value));
  };

  return (
    <View style={styles.root}>
      {isLoading && <SpinLoading message="Enviando e-mail de recuperação..." />}
      <Input
        icon="envelope"
        label="E-mail"
        placeholder="Digite seu e-mail aqui"
        invalidPhrase="Insira um e-mail válido!"
        onChangeText={validateEmail}
        onSubmitEditing={isEmailValid === "invalid" ? undefined : onSubmit}
        isValid={isEmailValid}
        value={email}
      />
      <Button
        onPress={isEmailValid === "invalid" ? undefined : onSubmit}
        disabled={isEmailValid === "invalid" || isEmailValid === null}
      >
        <Text style={{ color: Colors.light.background }}>
          Enviar e-mail de recuperação
        </Text>
      </Button>
    </View>
  );
}
