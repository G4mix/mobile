import { Image, StyleSheet, Text, TextInput } from 'react-native';
import { View } from '@/components/Themed';
import { Input } from '@/components/Input';
import { isValidEmail, isValidPassword, isValidUsername } from '@/constants/validations';
import { Button } from '@/components/Button';
import { Checkbox } from "@/components/Checkbox";
import { useRef, useState } from 'react';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function RegisterScreen() {
  const [isUsernameValid, setIsUsernameValid] = useState<'valid' | 'invalid' | null>(null)
  const [isEmailValid, setIsEmailValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordValid, setIsPasswordValid] = useState<'valid' | 'invalid' | null>(null)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<'valid' | 'invalid' | null>(null)

  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef  = useRef<HTMLInputElement>(null)

  const validateUsername = (value: string) => {
    setIsUsernameValid(isValidUsername(value))
  }

  const validateEmail = (value: string) => {
    setIsEmailValid(isValidEmail(value))
  }

  const validatePassword = (value: string) => {
    validatePasswordConfirm(confirmPasswordRef.current?.value || '')
    setIsPasswordValid(isValidPassword(value))
  }

  const validatePasswordConfirm = (value: string) => {
    const actualPassword = passwordRef.current?.value
    if (actualPassword?.length === 0 || value.length === 0) {
      setIsConfirmPasswordValid(null)
    } else if (actualPassword === value) {
      setIsConfirmPasswordValid('valid')
    } else {
      setIsConfirmPasswordValid('invalid')
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/favicon.png')} />
      <Text style={styles.title}>Criar uma conta</Text>
      <Input
        icon='user'
        // label='email'
        isPasswordInput={false}
        placeholder='Digite seu nome de usuário aqui'
        onChangeText={validateUsername}
        isValid={isUsernameValid}
      />
      <Input
        icon='envelope'
        // label='email'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={validateEmail}
        isValid={isEmailValid}
      />
      <Input
        icon='lock'
        // label='password'
        isPasswordInput={true}
        onChangeText={validatePassword}
        placeholder='Digite uma senha'
        isValid={isPasswordValid}
        ref={passwordRef}
      />
      <Input
        icon='lock'
        // label='password'
        isPasswordInput={true}
        onChangeText={validatePasswordConfirm}
        placeholder='Digite sua senha novamente'
        isValid={isConfirmPasswordValid}
        ref={confirmPasswordRef}
      />
      <View style={styles.termsContainer}>
        <Checkbox />
        <Text>Eu li e concordo com os <Link href='/terms' style={{ color: Colors['light'].majorelleBlue }}>termos e política de privacidade</Link></Text>
      </View>
      <Button>Registrar-se</Button>
      <Link href='/auth/login'>
        <Text style={{color: Colors['light'].russianViolet}}>Já tem uma conta?</Text>
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
  termsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
