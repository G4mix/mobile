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
      <FontAwesome size={28} name={icon} color='#FFFFFF' style={{display: 'flex'}} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={Colors['dark'].text}
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
    padding: 16,
    backgroundColor: Colors['light'].jet,
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
    color: Colors['dark'].text
  },
  valid: {
    backgroundColor: 'green'
  },
  invalid: {
    backgroundColor: 'red'
  }
})