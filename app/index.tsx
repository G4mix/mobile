import { Image, Pressable, StyleSheet } from 'react-native';
import { useForm } from "react-hook-form"
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { handleRequest } from '@/utils/handleRequest';
import { setUser, UserState } from '@/features/auth/userSlice';
import { api } from '@/constants/api';
import { useToast } from '@/hooks/useToast';
import { useEffect, useRef, useState } from 'react';
import { setItem } from '@/constants/storage';
import { useDispatch } from 'react-redux';
import { env } from '@/constants/env';
import { OAuthLogin } from '@/features/auth/OAuthLogin';

type FormData = {
  password: string;
  email: string;
}

export default function InitialScreen() {
  const providers = ['google', 'linkedin', 'github']

  const {
    watch,
    setValue,
    handleSubmit
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const router = useRouter()
  const passwordRef = useRef<HTMLInputElement>(null)

  const login = async ({ password, email }: FormData) => {
    if (isLoading) return
    const data = await handleRequest<{ accessToken: string; refreshToken: string; user: UserState; }>({
      requestFn: async () => await api.post('/auth/signin', { password, email }, { skipAuth: true } as any),
      showToast,
      setIsLoading
    })
    if (!data) return
    dispatch(setUser(data.user))
    await setItem('user', JSON.stringify(data.user))
    await setItem('accessToken', data.accessToken)
    await setItem('refreshToken', data.refreshToken)
    router.replace('/application/feed')
  }

  const onSubmit = handleSubmit(login)
  const email = watch('email');
  const password = watch('password');
  const isReadyToLogin = email.length > 0 && password.length > 0

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/favicon.png')} />
      <Text style={styles.title}>Entrar</Text>
      <View style={styles.connectionMethodsContainer}>
        {
          providers.map(provider => <OAuthLogin provider={provider as any} key={`handle-login-with-${provider}`} />)
        }
      </View>
      <Text style={{color: Colors['dark'].background, fontWeight: 'medium'}}>OU</Text>
      <Input
        icon='envelope'
        label='E-mail'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={(value: string) => setValue('email', value)}
        onSubmitEditing={() => passwordRef.current?.focus()}
        returnKeyType='next'
      />
      <View style={styles.passwordContainer}>
        <Input
          icon='lock'
          label='Senha'
          isPasswordInput={true}
          placeholder='Digite a sua senha'
          onChangeText={(value: string) => setValue('password', value)}
          onSubmitEditing={onSubmit}
          returnKeyType='done'
          ref={passwordRef}
        />
        <Link href='/auth/forget-password'>
          <Text style={{color: Colors['light'].tropicalIndigo}}>Esqueci minha senha</Text>
        </Link>
      </View>
      <Button onPress={isReadyToLogin && !isLoading ? onSubmit : undefined} disabled={!isReadyToLogin || isLoading}>Conectar-se</Button>
      <Link href='/auth/register'>
        <Text style={{color: Colors['light'].russianViolet}}>Ainda não tem uma conta?</Text>
        <Text style={{color: Colors['light'].tropicalIndigo}}> Criar conta</Text>
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
