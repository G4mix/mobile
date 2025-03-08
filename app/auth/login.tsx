import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Link } from 'expo-router';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/favicon.png')} />
      <Text style={styles.title}>Acesse sua conta</Text>
      <Input
        icon='envelope'
        label='E-mail'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
      />
      <View style={styles.passwordContainer}>
        <Input
          icon='lock'
          label='Senha'
          isPasswordInput={true}
          placeholder='Digite a sua senha'
        />
        <Link href='/auth/forget-password'>
          <Text style={{color: Colors['light'].tropicalIndigo}}>Esqueci minha senha</Text>
        </Link>
      </View>
      <Text style={{color: Colors['light'].russianViolet}}>Você também pode entrar com:</Text>
      <View style={styles.connectionMethodsContainer}>
        <Image
          source={require('../../assets/images/icons/google.svg')}
          style={{width: 24, height: 24, opacity: 0.7}}
        />
        <Image
          source={require('../../assets/images/icons/linkedin.svg')}
          style={{width: 24, height: 24, opacity: 0.7}}
        />
        <Image
          source={require('../../assets/images/icons/github.svg')}
          style={{width: 24, height: 24, opacity: 0.7}}
        />
      </View>

      <Button>Conectar-se</Button>
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
