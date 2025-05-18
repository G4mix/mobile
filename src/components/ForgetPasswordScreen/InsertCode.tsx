import { StyleSheet, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
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

type InsertCodeProps = {
  incrementStep: () => void;
  resetSteps: () => void;
};

type FormData = {
  code: string;
};

export function InsertCode({ incrementStep, resetSteps }: InsertCodeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const { watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      code: ""
    }
  });

  const changePassword = async ({ code }: FormData) => {
    if (isLoading) return;
    const data = await handleRequest({
      requestFn: async () =>
        api.post("/auth/verify-email-code", { code }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading,
      successMessage: "Código válido!"
    });
    if (!data) return;
    setValue("code", "");
    incrementStep();
  };
  const onSubmit = handleSubmit(changePassword);

  const code = watch("code");

  return (
    <View style={styles.root}>
      {isLoading && <SpinLoading message="Validando código..." />}
      <Input
        icon="lock-closed"
        label="Código de verificação"
        placeholder="Digite seu código de verificação aqui"
        onChangeText={(value) => setValue("code", value.slice(0, 6))}
        onSubmitEditing={code.length === 6 ? onSubmit : undefined}
        returnKeyType="done"
      />
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
