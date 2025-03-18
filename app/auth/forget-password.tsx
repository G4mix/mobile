import { Image, StyleSheet, View } from "react-native";

import { useState } from "react";
import { Link } from "expo-router";
import { Text } from "@components/Themed";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { isValidEmail } from "@constants/validations";
import { Colors } from "@constants/colors";
import favIcon from "@assets/images/favicon.png";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function ForgetPasswordScreen() {
  const [isEmailValid, setIsEmailValid] = useState<"valid" | "invalid" | null>(
    null
  );

  const validateEmail = (value: string) => {
    setIsEmailValid(isValidEmail(value));
  };

  return (
    <View style={styles.container}>
      <Image source={favIcon} />
      <Text style={styles.title}>Recupere sua conta</Text>
      <Input
        icon="envelope"
        label="E-mail"
        isPasswordInput={false}
        placeholder="Digite seu e-mail aqui"
        onChangeText={validateEmail}
        isValid={isEmailValid}
      />
      <Button>
        <Text>Enviar e-mail de recuperação</Text>
      </Button>
      <Link href="/">
        <Text style={{ color: Colors.light.russianViolet }}>
          Lembrou sua senha?
        </Text>
        <Text style={{ color: Colors.light.tropicalIndigo }}> Entrar</Text>
      </Link>
    </View>
  );
}
