import { StyleSheet } from "react-native";
import * as Calendar from "expo-calendar";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { PostType } from ".";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { formatFullDate } from "@/utils/formatDate";
import { useToast } from "@/hooks/useToast";

const styles = StyleSheet.create({
  postDescription: {
    color: Colors.light.majorelleBlue,
    fontSize: 13.33,
    marginVertical: 8,
    textAlign: "justify"
  },
  postEventBody: {
    gap: 4
  },
  postEventContainer: {
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
    padding: 12,
    width: "100%"
  },
  postEventFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  postEventHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  postEventLocation: {
    flexDirection: "row",
    fontSize: 13.33,
    gap: 8
  },
  postTitle: {
    color: Colors.light.majorelleBlue,
    fontSize: 16,
    fontWeight: "bold"
  }
});

type PostEventProps = {
  event: PostType["event"];
};

export function PostEvent({ event }: PostEventProps) {
  const { showToast } = useToast();
  if (!event) return null;

  const handlePress = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return;
    try {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      await Calendar.createEventInCalendarAsync({
        title: event.subject,
        startDate,
        endDate,
        location: event.location,
        notes: event.description,
        recurrenceRule: event.frequency
          ? {
              endDate,
              frequency: Calendar.Frequency[event.frequency]
            }
          : undefined
      });
      showToast({ message: "Evento salvo com sucesso!", color: "success" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToast({ message: "Falha ao salvar o evento!", color: "error" });
    }
  };
  return (
    <View style={styles.postEventContainer}>
      <View style={styles.postEventHeader}>
        <Icon name="calendar" color={Colors.light.majorelleBlue} size={24} />
        <Text style={styles.postTitle}>{event.subject}</Text>
      </View>
      {(event.description || event.location) && (
        <View style={styles.postEventBody}>
          {event.location ? (
            event.location.startsWith("https://") ? (
              <View style={styles.postEventLocation}>
                <Icon name="link" />
                <Text>Url do evento</Text>
              </View>
            ) : (
              <View style={styles.postEventLocation}>
                <Icon name="link" />
                <Text>Localização do evento</Text>
              </View>
            )
          ) : null}
          {event.description && (
            <Text style={styles.postDescription}>{event.description}</Text>
          )}
        </View>
      )}
      <View style={styles.postEventFooter}>
        <Text style={{ color: Colors.light.majorelleBlue }}>
          {formatFullDate(event.startDate)}
        </Text>
        <Button
          style={{ minWidth: null, paddingVertical: 10 }}
          onPress={handlePress}
        >
          <Text style={{ color: Colors.light.background }}>Salvar evento</Text>
        </Button>
      </View>
    </View>
  );
}
