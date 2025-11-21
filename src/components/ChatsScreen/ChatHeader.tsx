import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Image, View } from "react-native";
import { Header } from "../Header";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { Text } from "../Themed";
import { styles } from "./ChatItem";

function UserIcon({
  icon,
  displayName,
}: {
  icon?: string | null;
  displayName?: string | null;
}) {
  if (icon) {
    return (
      <Image
        source={{ uri: getImgWithTimestamp(icon) }}
        style={{
          ...styles.imageProfile,
          width: 32,
          height: 32,
        }}
      />
    );
  }
  return (
    <View
      style={{
        ...styles.imageProfile,
        width: 32,
        height: 32,
        backgroundColor: "#6200ee",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {displayName?.trim()[0]?.toUpperCase() || "?"}
      </Text>
    </View>
  );
}

export function ChatHeader({
  route,
  icon,
  displayName,
  ...props
}: NativeStackHeaderProps & {
  icon?: string | null;
  displayName?: string | null;
}) {
  const leftComponent = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <UserIcon icon={icon} displayName={displayName} />
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{displayName}</Text>
    </View>
  );

  return <Header {...props} route={route} leftComponent={leftComponent} />;
}
