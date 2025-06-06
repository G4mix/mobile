import { StyleSheet, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { Text, View } from "../Themed";
import { Input } from "../Input";
import { Button } from "../Button";
import { Colors } from "@/constants/colors";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { SpinLoading } from "../SpinLoading";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4
  },
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
  code: string;
};

type InsertCodeProps = {
  incrementStep: () => void;
  resetSteps: () => void;
  email: string;
  setToken: Dispatch<SetStateAction<string>>;
  changePassword: (data: { email: string }, increment: boolean) => void;
};

export function InsertCode({
  incrementStep,
  resetSteps,
  email,
  setToken,
  changePassword
}: InsertCodeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      code: ""
    }
  });

  const verifyCode = async ({ code }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest<{ accessToken: string }>({
      requestFn: async () =>
        api.post("/auth/verify-email-code", { code, email }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading,
      successMessage: "Código válido!"
    });
    if (!data) return;
    setToken(data.accessToken);
    setValue("code", "");
    incrementStep();
  };
  const onSubmit = handleSubmit(verifyCode);

  const code = watch("code");

  return (
    <View style={styles.root}>
      {isLoading && <SpinLoading message="Validando código..." />}
      <View style={{ gap: 4 }}>
        <Input
          icon="lock-closed"
          label="Código de verificação"
          placeholder="Digite seu código de verificação aqui"
          onChangeText={(value) => setValue("code", value.slice(0, 6))}
          value={code}
          onSubmitEditing={code.length === 6 ? onSubmit : undefined}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={() => changePassword({ email }, false)}>
          <Text style={{ color: Colors.light.tropicalIndigo }}>
            Reenviar código
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Button
          onPress={code.length === 6 ? onSubmit : undefined}
          disabled={code.length !== 6}
        >
          <Text style={{ color: Colors.light.background }}>
            Validar código de verificação
          </Text>
        </Button>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 4 }}
          onPress={resetSteps}
        >
          <Text style={{ color: Colors.light.russianViolet }}>
            Enviei para o e-mail errado!
          </Text>
          <Text style={{ color: Colors.light.tropicalIndigo }}>
            Tentar novamente.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
