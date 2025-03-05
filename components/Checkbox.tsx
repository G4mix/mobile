import { CheckBox as CheckboxDefault } from '@rneui/themed';
import { useState } from 'react';
import Colors from '@/constants/Colors';

export const Checkbox = () => {
  const [isChecked, setChecked] = useState(false);

  return (
    <CheckboxDefault
      style={{padding: 0}}
      checked={isChecked}
      containerStyle={{padding: 0}}
      checkedColor={Colors['light'].majorelleBlue}
      uncheckedColor={Colors['light'].russianViolet}
      size={32}
      onPress={() => setChecked(prevValue => !prevValue)}
      iconType="material-community"
      checkedIcon="checkbox-outline"
      uncheckedIcon={'checkbox-blank-outline'}
    />
  );
}
