import { TextInput, View, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { forwardRef } from 'react';

type InputProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  placeholder: string;
  invalidPhrase?: string;
  isPasswordInput?: boolean;
  isValid?: 'invalid' | 'valid' | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder, icon, isValid=null, invalidPhrase, onChangeText, isPasswordInput, onBlur, onFocus, label }, ref) => {
  return (
    <View style={styles.root}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.container, isValid === 'valid' ? styles.valid : {}, isValid === 'invalid' ? styles.invalid : {}]}>
        <FontAwesome
          size={24}
          name={icon}
          color={
            isValid === null ? Colors['light'].russianViolet : isValid === 'valid' ? 'green' : 'red' 
          }
          style={{display: 'flex', width: 24, height: 24, justifyContent: 'center'}}
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={Colors['light'].russianViolet}
          secureTextEntry={isPasswordInput}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref as any}
        />
      </View>
      {
        isValid === 'invalid' && invalidPhrase && (
          <View style={styles.errorMessage}>
            <FontAwesome size={20} name='exclamation-circle' color={Colors['light'].red}/>
            <Text style={{color: Colors['light'].red}}>{invalidPhrase}</Text>
          </View>
        )
      }
    </View>
  )
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    display: 'flex',
    gap: 4
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: Colors['light'].russianViolet,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
    width: '100%',
  },
  inputLabel: {
    color: Colors['light'].russianViolet,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
    padding: 0,
    color: Colors['light'].russianViolet
  },
  valid: {
    borderColor: 'green',
  },
  invalid: {
    borderColor: 'red',
  },
  errorMessage: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingLeft: 6
  }
})