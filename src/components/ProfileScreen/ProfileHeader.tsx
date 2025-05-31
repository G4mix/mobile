import { Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Text, View } from "../Themed";
import { styles } from "../Post/PostHeader";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RootState } from "@/constants/reduxStore";

export function ProfileHeader({
  id,
  backgroundImage,
  displayName,
  username,
  icon,
  disableControls = false
}: {
  id: string;
  backgroundImage?: string | null;
  displayName?: string | null;
  username?: string;
  icon?: string | null;
  disableControls?: boolean;
}) {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View style={{ width: "100%", position: "relative", gap: 28 }}>
      <View
        style={{
          width: "100%",
          height: 100,
          backgroundColor: !backgroundImage ? "#353535" : undefined
        }}
      >
        {backgroundImage && (
          <Image
            source={{ uri: backgroundImage }}
            style={{ width: "100%", height: 100 }}
            resizeMode="cover"
          />
        )}
      </View>
      {!disableControls && user.id === id && (
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
            position: "absolute",
            top: 114,
            width: "100%",
            alignItems: "center",
            zIndex: 2
          }}
        >
          <Button
            style={{
              minWidth: "auto",
              paddingHorizontal: 14,
              paddingVertical: 8
            }}
            onPress={() => router.push("/configurations/profile")}
          >
            <Text style={{ color: Colors.light.white }}>Editar</Text>
          </Button>
          <TouchableOpacity onPress={() => router.push("/configurations")}>
            <Icon
              size={24}
              name="cog-6-tooth"
              color={Colors.light.russianViolet}
              style={{
                width: 24,
                height: 24
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      {displayName ||
        (username && (
          <Text
            style={{
              color: Colors.light.russianViolet,
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              zIndex: 3
            }}
          >
            {displayName || username}
          </Text>
        ))}
      {icon ? (
        <Image
          source={{ uri: icon }}
          style={{
            ...styles.imageProfile,
            width: 80,
            height: 80,
            position: "absolute",
            top: 60,
            left: "50%",
            zIndex: 100,
            transform: [{ translateX: -40 }] as any
          }}
        />
      ) : (
        <View
          style={{
            position: "absolute",
            top: 50,
            left: "50%",
            zIndex: 2,
            transform: [{ translateX: -36 }] as any,
            borderRadius: 9999,
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Icon
            size={80}
            name="user-circle"
            color={Colors.light.majorelleBlue}
            style={{
              width: 80,
              height: 80
            }}
          />
        </View>
      )}
    </View>
  );
}
