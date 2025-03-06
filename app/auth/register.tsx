import { Image, StyleSheet, Text, TextInput } from 'react-native';
import { View } from '@/components/Themed';
import { Input } from '@/components/Input';
import { isValidEmail, isValidPassword, isValidPasswordLength, isValidPasswordNumber, isValidPasswordSpecialChar, isValidPasswordUppercase, isValidUsername } from '@/constants/validations';
import { Button } from '@/components/Button';
import { Checkbox } from "@/components/Checkbox";
import { useRef, useState } from 'react';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/colors';

export default function RegisterScreen() {
  const [isUsernameValid, setIsUsernameValid] = useState<'valid' | 'invalid' | null>(null)
  const [isEmailValid, setIsEmailValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordValid, setIsPasswordValid] = useState<'valid' | 'invalid' | null>(null)
  const [isRequirementsVisible, setIsRequirementsVisible] = useState(false)
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordSpecialCharValid, setIsPasswordSpecialCharValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordNumberValid, setIsPasswordNumberValid] = useState<'valid' | 'invalid' | null>(null)
  const [isPasswordUppercaseValid, setIsPasswordUppercaseValid] = useState<'valid' | 'invalid' | null>(null)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<'valid' | 'invalid' | null>(null)

  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef  = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsRequirementsVisible(true)
  }
  
  const handleBlur = () => {
    setIsRequirementsVisible(false)
  }

  const validateUsername = (value: string) => {
    setIsUsernameValid(isValidUsername(value))
  }

  const validateEmail = (value: string) => {
    setIsEmailValid(isValidEmail(value))
  }

  const validatePassword = (value: string) => {
    validatePasswordConfirm(confirmPasswordRef.current?.value || '')
    setIsPasswordValid(isValidPassword(value))
    setIsPasswordLengthValid(isValidPasswordLength(value))
    setIsPasswordSpecialCharValid(isValidPasswordSpecialChar(value))
    setIsPasswordNumberValid(isValidPasswordNumber(value))
    setIsPasswordUppercaseValid(isValidPasswordUppercase(value))
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

  const requirements = [
    { condition: isPasswordLengthValid, text: '6 a 72 caracteres' },
    { condition: isPasswordSpecialCharValid, text: '1 caractere especial' },
    { condition: isPasswordNumberValid, text: '1 número' },
    { condition: isPasswordUppercaseValid, text: '1 caractere maiúsculo' }
  ]

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/favicon.png')} />
      <Text style={styles.title}>Criar uma conta</Text>
      <Input
        icon='user'
        label='Nome de Usuário'
        isPasswordInput={false}
        placeholder='Digite seu nome de usuário aqui'
        onChangeText={validateUsername}
        isValid={isUsernameValid}
      />
      <Input
        icon='envelope'
        label='E-mail'
        isPasswordInput={false}
        placeholder='Digite seu e-mail aqui'
        onChangeText={validateEmail}
        isValid={isEmailValid}
      />
      <Input
        icon='lock'
        label='Senha'
        isPasswordInput={true}
        onChangeText={validatePassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder='Digite uma senha'
        isValid={isPasswordValid}
        ref={passwordRef}
      />
      {
        isRequirementsVisible && (
          <View style={styles.passwordRequirements}>
            <Text style={{color: Colors['light'].russianViolet}}>A senha deve conter no mínimo:</Text>
            <View style={styles.requirementsContainer}>
              {
                requirements.map(({ condition, text }) => (
                  <View
                    style={[styles.requirement, condition === 'valid' ? styles.requirementValid : {}, condition === 'invalid' ? styles.requirementInvalid : {}]}
                    key={text}
                  >
                    {condition === 'valid' && (<FontAwesome name={'check'} size={20} color={'green'} />)}
                    {condition === 'invalid' && (<FontAwesome name={'times'} size={20} color={'red'} />)}
                    <Text style={{
                      color: condition === 'valid'
                        ? Colors['light'].green : condition === 'invalid'
                          ? Colors['light'].red : Colors['light'].jet
                    }}>{text}</Text>
                  </View>
                ))
              }
            </View>
          </View>
        )
      }
      <Input
        icon='lock'
        label='Confirme a senha'
        isPasswordInput={true}
        onChangeText={validatePasswordConfirm}
        invalidPhrase='As senhas não são iguais'
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
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 16,
    overflowY: 'auto'
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
  passwordRequirements: {
    display: 'flex',
    width: '100%',
    padding: 12,
    gap: 4,
    borderColor: Colors['light'].majorelleBlue,
    borderRadius: 8,
    borderWidth: 1
  },
  requirementsContainer: {
    display: 'flex',
    width: '100%',
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  requirement: {
    display: 'flex',
    minWidth: '40%',
    flexGrow: 1,
    padding: 4,
    gap: 4,
    borderColor: Colors['light'].jet,
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
  },
  requirementValid: {
    borderColor: Colors['light'].green,
  },
  requirementInvalid: {
    borderColor: Colors['light'].red,
  },
});
