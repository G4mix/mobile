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
  onlyView = false,
  onPressBackground,
  onPressIcon
}: {
  id: string;
  backgroundImage?: string | null;
  displayName?: string | null;
  username?: string;
  icon?: string | null;
  onlyView?: boolean;
  onPressBackground?: () => void;
  onPressIcon?: () => void;
}) {
  const user = useSelector((state: RootState) => state.user);
  const EditableComponent = !onlyView ? TouchableOpacity : View;

  return (
    <View
      style={{
        width: "100%",
        position: "relative",
        gap: 28,
        marginBottom: !onlyView ? 12 : 0
      }}
    >
      <EditableComponent
        style={{
          width: "100%",
          height: 100,
          backgroundColor: !backgroundImage ? "#353535" : undefined,
          borderRadius: !onlyView ? 16 : 0
        }}
        onPress={!onlyView ? onPressBackground : undefined}
      >
        {!onlyView && (
          <Icon
            name="pencil"
            size={16}
            color={Colors.light.white}
            style={{ position: "absolute", right: 12, top: 12, zIndex: 2 }}
          />
        )}
        {backgroundImage && (
          <Image
            source={{ uri: backgroundImage }}
            style={{
              width: "100%",
              height: 100,
              borderRadius: !onlyView ? 16 : 0
            }}
            resizeMode="cover"
          />
        )}
      </EditableComponent>
      {onlyView && user.id === id && (
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
      {(displayName || username) && (
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
      )}
      {icon ? (
        <EditableComponent
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            width: 84,
            height: 84,
            zIndex: 100,
            transform: [{ translateX: -42 }] as any,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.light.background,
            borderRadius: 9999
          }}
          onPress={!onlyView ? onPressIcon : undefined}
        >
          <Image
            source={{ uri: icon }}
            style={{
              ...styles.imageProfile,
              width: 80,
              height: 80
            }}
          />
        </EditableComponent>
      ) : (
        <EditableComponent
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
            justifyContent: "center",
            backgroundColor: Colors.light.background
          }}
          onPress={!onlyView ? onPressIcon : undefined}
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
        </EditableComponent>
      )}
    </View>
  );
}
