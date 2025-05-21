import { StyleSheet } from "react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "../Themed";
import { Input } from "../Input";
import { Colors } from "@/constants/colors";
import { Button } from "../Button";
import { isValidEmail } from "@/constants/validations";

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

type FormData = {
  email: string;
};

type SendRecoverEmailProps = {
  changePassword: (data: { email: string }, increment: boolean) => void;
};

export function SendRecoverEmail({ changePassword }: SendRecoverEmailProps) {
  const [isEmailValid, setIsEmailValid] = useState<"valid" | "invalid" | null>(
    null
  );

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = handleSubmit((data) => {
    changePassword(data, true);
    setValue("email", "");
  });

  const email = watch("email");

  const validateEmail = (value: string) => {
    setValue("email", value);
    setIsEmailValid(isValidEmail(value));
  };

  return (
    <View style={styles.root}>
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
