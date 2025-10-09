import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData
} from "react-native";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Colors } from "@/constants/colors";
import { Input } from "./Input";
import { Text, View } from "./Themed";
import { Icon } from "./Icon";
import {
  isValidPassword,
  isValidPasswordLength,
  isValidPasswordNumber,
  isValidPasswordSpecialChar,
  isValidPasswordUppercase
} from "@/constants/validations";

const styles = StyleSheet.create({
  passwordRequirements: {
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    gap: 4,
    padding: 12,
    width: "100%"
  },
  requirement: {
    borderColor: Colors.light.jet,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    gap: 4,
    minWidth: "40%",
    padding: 4
  },
  requirementInvalid: {
    borderColor: Colors.light.red
  },
  requirementValid: {
    borderColor: Colors.light.green
  },
  requirementsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "100%"
  },
  root: {
    backgroundColor: "transparent",
    gap: 16
  }
});

type ChangePasswordInputsProps = {
  onSubmit: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  setValue: UseFormSetValue<{ password: string; confirmPassword: string }>;
  watch: UseFormWatch<{ password: string; confirmPassword: string }>;
  isConfirmPasswordValid: "valid" | "invalid" | null;
  isPasswordValid: "valid" | "invalid" | null;
  setIsConfirmPasswordValid: Dispatch<
    SetStateAction<"valid" | "invalid" | null>
  >;
  setIsPasswordValid: Dispatch<SetStateAction<"valid" | "invalid" | null>>;
};

type ChangePasswordInputsRef = {
  focus: () => void;
};

export const ChangePasswordInputs = forwardRef<
  ChangePasswordInputsRef,
  ChangePasswordInputsProps
>(
  (
    {
      onSubmit,
      setValue,
      watch,
      isConfirmPasswordValid,
      isPasswordValid,
      setIsConfirmPasswordValid,
      setIsPasswordValid
    },
    ref
  ) => {
    const [isRequirementsVisible, setIsRequirementsVisible] = useState(false);
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState<
      "valid" | "invalid" | null
    >(null);
    const [isPasswordSpecialCharValid, setIsPasswordSpecialCharValid] =
      useState<"valid" | "invalid" | null>(null);
    const [isPasswordNumberValid, setIsPasswordNumberValid] = useState<
      "valid" | "invalid" | null
    >(null);
    const [isPasswordUppercaseValid, setIsPasswordUppercaseValid] = useState<
      "valid" | "invalid" | null
    >(null);

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => passwordRef.current?.focus()
      }),
      []
    );

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const validatePasswordConfirm = (
      value?: string,
      actualPassword?: string
    ) => {
      if (value) setValue("confirmPassword", value);
      const pwd = actualPassword || password;
      const cp = value || confirmPassword;
      if (pwd.length === 0 || cp.length === 0) {
        setIsConfirmPasswordValid(null);
      } else if (pwd === cp) {
        setIsConfirmPasswordValid("valid");
      } else {
        setIsConfirmPasswordValid("invalid");
      }
    };

    const validatePassword = (value: string) => {
      setValue("password", value);
      validatePasswordConfirm(undefined, value);
      setIsPasswordValid(isValidPassword(value));
      setIsPasswordLengthValid(isValidPasswordLength(value));
      setIsPasswordSpecialCharValid(isValidPasswordSpecialChar(value));
      setIsPasswordNumberValid(isValidPasswordNumber(value));
      setIsPasswordUppercaseValid(isValidPasswordUppercase(value));
    };

    const requirements = [
      { condition: isPasswordLengthValid, text: "6 caracteres" },
      { condition: isPasswordSpecialCharValid, text: "1 caractere especial" },
      { condition: isPasswordNumberValid, text: "1 número" },
      { condition: isPasswordUppercaseValid, text: "1 caractere maiúsculo" }
    ];

    const handleFocus = () => {
      setIsRequirementsVisible(true);
    };

    const handleBlur = () => {
      setIsRequirementsVisible(false);
    };

    useEffect(() => () => setIsRequirementsVisible(false), []);

    return (
      <View style={styles.root}>
        <Input
          icon="lock-closed"
          label="Senha"
          isPasswordInput
          onChangeText={validatePassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Digite uma senha"
          isValid={isPasswordValid}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          ref={passwordRef}
          returnKeyType="next"
        />
        {isRequirementsVisible && (
          <View style={styles.passwordRequirements}>
            <Text style={{ color: Colors.light.russianViolet }}>
              A senha deve conter no mínimo:
            </Text>
            <View style={styles.requirementsContainer}>
              {requirements.map(({ condition, text }) => (
                <View
                  style={[
                    styles.requirement,
                    condition === "valid" ? styles.requirementValid : {},
                    condition === "invalid" ? styles.requirementInvalid : {}
                  ]}
                  key={text}
                >
                  {condition === "valid" && (
                    <Icon name="check" size={20} color="green" />
                  )}
                  {condition === "invalid" && (
                    <Icon name="x-mark" size={20} color="red" />
                  )}
                  <Text
                    style={{
                      color:
                        condition === "valid"
                          ? Colors.light.green
                          : condition === "invalid"
                            ? Colors.light.red
                            : Colors.light.jet
                    }}
                  >
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <Input
          icon="lock-closed"
          label="Confirme a senha"
          isPasswordInput
          onChangeText={validatePasswordConfirm}
          invalidPhrase="As senhas não são iguais"
          placeholder="Digite sua senha novamente"
          isValid={isConfirmPasswordValid}
          onSubmitEditing={onSubmit}
          ref={confirmPasswordRef}
          returnKeyType="done"
        />
      </View>
    );
  }
);
