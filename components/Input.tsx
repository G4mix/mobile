import { TextInput, View, StyleSheet } from 'react-native';
import {  } from 'react-native';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { forwardRef, useState } from 'react';

type InputProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  placeholder: string;
  isPasswordInput: boolean;
  isValid: 'invalid' | 'valid' | null;
  onChangeText: (value: string) => void;
  // label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder, icon, isValid, onChangeText, isPasswordInput }, ref) => {
  return (
    <View style={[styles.container, isValid === 'valid' ? styles.valid : {}, isValid === 'invalid' ? styles.invalid : {}]}>
      {/* <Text style={styles.text}>{children}</Text> */}
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
        ref={ref as any}
      />
    </View>
  )
});

const styles = StyleSheet.create({
  root: {
    padding: 16,
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
  }
})