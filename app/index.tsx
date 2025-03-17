import { Image, StyleSheet } from 'react-native';
import { useForm } from "react-hook-form"
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Link } from 'expo-router';
import Colors from '@/constants/colors';
import colors from '@/constants/colors';

type FormData = {
  password: string;
  email: string;
}

export default function LoginScreen() {
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

  const onSubmit = handleSubmit((data: FormData) => console.log(data))
  const email = watch('email');
  const password = watch('password');
  const isReadyToLogin = email.length > 0 && password.length > 0

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/favicon.png')} />
      <Text style={styles.title}>Entrar</Text>
      <View style={styles.connectionMethodsContainer}>
        <View style={{borderRadius: 8, borderWidth: 1, borderColor: colors.light.tropicalIndigo, padding: 6, opacity: 0.7}}>
          <Image
            source={require('../assets/images/icons/google.png')}
            style={{width: 32, height: 32}}
          />
        </View>
        <View style={{borderRadius: 8, borderWidth: 1, borderColor: colors.light.tropicalIndigo, padding: 6, opacity: 0.7}}>
          <Image
            source={require('../assets/images/icons/linkedin.png')}
            style={{width: 32, height: 32}}
          />
        </View>
        <View style={{borderRadius: 8, borderWidth: 1, borderColor: colors.light.tropicalIndigo, padding: 6, opacity: 0.7}}>
          <Image
            source={require('../assets/images/icons/github.png')}
            style={{width: 32, height: 32}}
          />
        </View>
      </View>
      <Text style={{color: Colors['dark'].background, fontWeight: 'medium'}}>OU</Text>
      <Input
        icon='envelope'
        label='E-mail'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={(value: string) => setValue('email', value)}
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
        />
        <Link href='/auth/forget-password'>
          <Text style={{color: Colors['light'].tropicalIndigo}}>Esqueci minha senha</Text>
        </Link>
      </View>


      <Button onPress={isReadyToLogin ? onSubmit : undefined} disabled={!isReadyToLogin}>Conectar-se</Button>
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
