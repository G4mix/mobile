import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { isValidEmail, isValidPassword } from '@/constants/validations';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [isEmailValid, setIsEmailValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordValid, setIsPasswordValid] = useState<'valid' | 'invalid' | null>(null)

  const validateEmail = (value: string) => {
    setIsEmailValid(isValidEmail(value))
  }

  const validatePassword = (value: string) => {
    setIsPasswordValid(isValidPassword(value))
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/favicon.png')} />
      <Text style={styles.title}>Acesse sua conta</Text>
      <Input
        icon='envelope'
        // label='email'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={validateEmail}
        isValid={isEmailValid}
      />
      <View style={styles.passwordContainer}>
        <Input
          icon='lock'
          // label='password'
          isPasswordInput={true}
          onChangeText={validatePassword}
          placeholder='Digite uma senha'
          isValid={isPasswordValid}
        />
        <Text>Esqueci minha senha</Text>
      </View>
      <Text>Você também pode entrar com:</Text>
      <View style={styles.connectionMethodsContainer}>
        <FontAwesome size={28} name='google' color='#000000' style={{display: 'flex'}} />
        <FontAwesome size={28} name='linkedin-square' color='#000000' style={{display: 'flex'}} />
        <FontAwesome size={28} name='github' color='#000000' style={{display: 'flex'}} />
      </View>

      <Button>Conectar-se</Button>
      <Link href='/auth/register'><Text>Ainda não tem uma conta?</Text></Link>
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
    gap: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
