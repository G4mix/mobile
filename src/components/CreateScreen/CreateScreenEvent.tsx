import { UseFormSetValue } from "react-hook-form";
import { useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleSheet } from "react-native";
import { CreateScreenFormData } from "@/app/(tabs)/create";
import { Text, View } from "../Themed";
import { Input } from "../Input";
import { Colors } from "@/constants/colors";
import { ExternalInput } from "../ExternalInput";

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 2,
    borderColor: Colors.light.tropicalIndigo,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  dateInput: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 8
  },
  header: {
    backgroundColor: Colors.light.majorelleBlue,
    borderColor: Colors.light.tropicalIndigo,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14
  }
});

type CreateScreenEventProps = {
  isAddEventVisible: boolean;
  setValue: UseFormSetValue<CreateScreenFormData>;
  // watch: UseFormWatch<CreateScreenFormData>;
};
export function CreateScreenEvent({
  isAddEventVisible,
  setValue
  // watch
}: CreateScreenEventProps) {
  // const event = watch("event");
  const descriptionRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showPicker = (pickerMode: "date" | "time") => {
    setMode(pickerMode);
    setShow(true);
  };

  if (!isAddEventVisible) return null;

  return (
    <View>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "medium",
            color: Colors.light.background
          }}
        >
          Evento
        </Text>
      </View>
      <View style={styles.container}>
        <Input
          placeholder="Qual o assunto do seu evento?"
          label="Assunto do evento"
          onChangeText={(value) => setValue("event.subject", value)}
          onSubmitEditing={() => descriptionRef.current?.focus()}
          color={Colors.light.majorelleBlue}
          returnKeyType="next"
        />
        <Input
          placeholder="Descreva um pouco do seu evento"
          label="Descrição"
          onChangeText={(value) => setValue("event.description", value)}
          onSubmitEditing={() => locationRef.current?.focus()}
          ref={descriptionRef}
          color={Colors.light.majorelleBlue}
          returnKeyType="next"
        />
        <Input
          placeholder="Informe o endereço ou link do evento"
          label="Localização do evento"
          onChangeText={(value) => setValue("event.location", value)}
          ref={locationRef}
          color={Colors.light.majorelleBlue}
          returnKeyType="done"
        />
        <View style={styles.dateInput}>
          <ExternalInput
            value="11/04/2025"
            label="Data de início"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("date")}
            width="70%"
          />
          <ExternalInput
            value="00:00"
            label="Hora de início"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("time")}
            width="30%"
          />
        </View>
        <View style={styles.dateInput}>
          <ExternalInput
            value="11/04/2025"
            label="Data de encerramento"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("date")}
            width="70%"
          />
          <ExternalInput
            value="00:00"
            label="Hora de encerramento"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("time")}
            width="30%"
          />
        </View>
        {show && (
          <DateTimePicker
            value={date}
            minimumDate={new Date()}
            display="default"
            mode={mode}
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
}
