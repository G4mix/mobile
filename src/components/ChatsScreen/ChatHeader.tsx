import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Image } from "expo-image";
import { Header } from "../Header";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";
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
        source={{ uri: getCachedImageUrl(icon) }}
        style={{
          ...styles.imageProfile,
          width: 32,
          height: 32,
        }}
        cachePolicy="memory-disk"
        contentFit="cover"
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
