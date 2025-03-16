import { CheckBox as CheckboxDefault } from '@rneui/themed';
import { Dispatch, SetStateAction, useState } from 'react';
import Colors from '@/constants/colors';

type CheckboxProps = {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}

export const Checkbox = ({ isChecked, setIsChecked }: CheckboxProps) => {
  return (
    <CheckboxDefault
      style={{padding: 0}}
      checked={isChecked}
      containerStyle={{padding: 0}}
      checkedColor={Colors['light'].majorelleBlue}
      uncheckedColor={Colors['light'].russianViolet}
      size={32}
      onPress={() => setIsChecked(prevValue => !prevValue)}
      iconType="material-community"
      checkedIcon="checkbox-outline"
      uncheckedIcon={'checkbox-blank-outline'}
    />
  );
}
