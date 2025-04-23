import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { CreateScreenFormData } from "@/app/(tabs)/create";
import { Text, View } from "../Themed";
import { Input } from "../Input";
import { Colors } from "@/constants/colors";
import { ExternalInput } from "../ExternalInput";
import { formatEventDate, formatEventTime } from "@/utils/formatDate";
import { getDate } from "@/utils/getDate";

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
    justifyContent: "space-between",
    width: "100%"
  },
  eventDropdown: {
    alignItems: "center",
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    width: "100%"
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
  watch: UseFormWatch<CreateScreenFormData>;
};
export function CreateScreenEvent({
  isAddEventVisible,
  setValue,
  watch
}: CreateScreenEventProps) {
  const event = watch("event");
  const descriptionRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [type, setType] = useState<string | undefined>(undefined);
  const data = [
    { label: "Diariamente", value: "DAILY" },
    { label: "Mensalmente", value: "MONTHLY" },
    { label: "Semanalmente", value: "WEEKLY" },
    { label: "Anualmente", value: "YEARLY" }
  ];

  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (!selectedDate) return;
    const dateTypeString = type === "start" ? "startDate" : "endDate";
    const dateString = event?.[dateTypeString];
    const date = dateString ? new Date(dateString) : getDate();
    if (mode === "date") {
      date.setFullYear(selectedDate.getFullYear());
      date.setMonth(selectedDate.getMonth());
      date.setDate(selectedDate.getDate());
    } else {
      date.setHours(selectedDate.getHours());
      date.setMinutes(selectedDate.getMinutes());
      date.setSeconds(selectedDate.getSeconds());
      date.setMilliseconds(selectedDate.getMilliseconds());
    }
    setValue(`event.${dateTypeString}`, date.toISOString());
  };

  const showPicker = (
    pickerMode: "date" | "time",
    pickerType: "start" | "end"
  ) => {
    setType(pickerType);
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
          value={event?.subject}
        />
        <Input
          placeholder="Descreva um pouco do seu evento"
          label="Descrição"
          onChangeText={(value) => setValue("event.description", value)}
          onSubmitEditing={() => locationRef.current?.focus()}
          ref={descriptionRef}
          color={Colors.light.majorelleBlue}
          returnKeyType="next"
          value={event?.description}
        />
        <Input
          placeholder="Informe o endereço ou link do evento"
          label="Localização do evento"
          onChangeText={(value) => setValue("event.location", value)}
          ref={locationRef}
          color={Colors.light.majorelleBlue}
          returnKeyType="done"
          value={event?.location}
        />
        <View style={styles.dateInput}>
          <ExternalInput
            value={formatEventDate(event?.startDate || getDate().toISOString())}
            label="Data de início"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("date", "start")}
            width="70%"
          />
          <ExternalInput
            value={formatEventTime(event?.startDate || getDate().toISOString())}
            label="Hora de início"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("time", "start")}
            width="28%"
          />
        </View>
        <View style={styles.dateInput}>
          <ExternalInput
            value={formatEventDate(event?.endDate || getDate().toISOString())}
            label="Data de encerramento"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("date", "end")}
            width="70%"
          />
          <ExternalInput
            value={formatEventTime(event?.endDate || getDate().toISOString())}
            label="Hora de encerramento"
            color={Colors.light.majorelleBlue}
            onPress={() => showPicker("time", "end")}
            width="28%"
          />
        </View>
        <View
          style={{
            gap: 4,
            width: "100%"
          }}
        >
          <Text
            style={{ color: Colors.light.majorelleBlue, fontWeight: "bold" }}
          >
            Frequência do evento
          </Text>
          <Dropdown
            data={data}
            onChange={(item) => setValue("event.frequency", item.value)}
            value={
              event?.frequency
                ? data.find((d) => d.value === event.frequency)
                : undefined
            }
            labelField="label"
            valueField="value"
            placeholder={
              event?.frequency
                ? data.find((d) => d.value === event.frequency)?.label
                : "Selecione um item"
            }
            style={styles.eventDropdown}
            iconColor={Colors.light.majorelleBlue}
          />
        </View>
        {show && (
          <DateTimePicker
            value={getDate()}
            minimumDate={getDate()}
            display="default"
            mode={mode}
            onChange={onChange}
            is24Hour
          />
        )}
      </View>
    </View>
  );
}
