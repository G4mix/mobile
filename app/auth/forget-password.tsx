import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { isValidEmail } from '@/constants/validations';
import { useState } from 'react';
import { Link } from 'expo-router';
import Colors from '@/constants/colors';

export default function ForgetPasswordScreen() {
  const [isEmailValid, setIsEmailValid] = useState<'valid' | 'invalid' | null>(null)

  const validateEmail = (value: string) => {
    setIsEmailValid(isValidEmail(value))
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/favicon.png')} />
      <Text style={styles.title}>Recupere sua conta</Text>
      <Input
        icon='envelope'
        label='E-mail'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={validateEmail}
        isValid={isEmailValid}
      />
      <Button>Enviar e-mail de recuperação</Button>
      <Link href='/auth/login'>
        <Text style={{color: Colors['light'].russianViolet}}>Lembrou sua senha?</Text>
        <Text style={{color: Colors['light'].tropicalIndigo}}> Entrar</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    gap: 16
  },
  passwordContainer: {
    width: '100%',
    display: 'flex',
    gap: 4
  },
  connectionMethodsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors['light'].russianViolet
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
