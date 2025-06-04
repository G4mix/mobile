import { Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Text, View } from "../Themed";
import { styles } from "../Post/PostHeader";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RootState } from "@/constants/reduxStore";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

export function ProfileHeader({
  id,
  backgroundImage,
  displayName,
  username,
  icon,
  onlyView = false,
  onPressBackground,
  onPressIcon,
  followingCount,
  followersCount
}: {
  id: string;
  backgroundImage?: string | null;
  displayName?: string | null;
  username?: string;
  icon?: string | null;
  onlyView?: boolean;
  followingCount?: number;
  followersCount?: number;
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
            source={{ uri: getImgWithTimestamp(backgroundImage) }}
            style={{
              width: "100%",
              height: 100,
              borderRadius: !onlyView ? 16 : 0
            }}
            resizeMode="cover"
          />
        )}
      </EditableComponent>
      {onlyView &&
        (user.id === id ? (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 16,
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
        ) : (
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              paddingHorizontal: 16,
              position: "absolute",
              top: 114,
              width: "100%",
              alignItems: "center",
              zIndex: 2,
              gap: 4
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
              <Text style={{ color: Colors.light.white }}>Seguir</Text>
            </Button>
            <Icon
              size={24}
              name="ellipsis-horizontal"
              color={Colors.light.russianViolet}
              style={{
                width: 24,
                height: 24,
                opacity: 0.7
              }}
            />
          </View>
        ))}
      <View style={{ gap: 12 }}>
        {(displayName || username) && (
          <Text
            style={[
              {
                color: Colors.light.russianViolet,
                fontSize: 16,
                fontWeight: "bold",
                zIndex: 3
              },
              user.id === id
                ? { textAlign: "center" }
                : { textAlign: "left", paddingLeft: 16 }
            ]}
          >
            {displayName || username}
          </Text>
        )}
        {onlyView && (
          <View
            style={[
              {
                alignItems: "center",
                flexDirection: "row",
                gap: 16
              },
              user.id === id
                ? { justifyContent: "center" }
                : { paddingLeft: 16 }
            ]}
          >
            <View style={{ gap: 4, flexDirection: "row" }}>
              <Text
                style={{
                  color: Colors.light.russianViolet,
                  fontSize: 16,
                  fontWeight: "bold",
                  zIndex: 3
                }}
              >
                {followersCount}
              </Text>
              <Text
                style={{
                  color: Colors.light.russianViolet,
                  fontSize: 16,
                  zIndex: 3
                }}
              >
                seguidores
              </Text>
            </View>
            <View style={{ gap: 4, flexDirection: "row" }}>
              <Text
                style={{
                  color: Colors.light.russianViolet,
                  fontSize: 16,
                  fontWeight: "bold",
                  zIndex: 3
                }}
              >
                {followingCount}
              </Text>
              <Text
                style={{
                  color: Colors.light.russianViolet,
                  fontSize: 16,
                  zIndex: 3
                }}
              >
                seguindo
              </Text>
            </View>
          </View>
        )}
      </View>
      {icon ? (
        <EditableComponent
          style={[
            {
              position: "absolute",
              top: 40,
              width: 84,
              height: 84,
              zIndex: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.light.background,
              borderRadius: 9999
            },
            user.id === id
              ? { left: "50%", transform: [{ translateX: -42 }] as any }
              : { left: 16 }
          ]}
          onPress={!onlyView ? onPressIcon : undefined}
        >
          <Image
            source={{ uri: getImgWithTimestamp(icon) }}
            style={{
              ...styles.imageProfile,
              width: 80,
              height: 80
            }}
          />
        </EditableComponent>
      ) : (
        <EditableComponent
          style={[
            {
              position: "absolute",
              top: 50,
              zIndex: 2,
              borderRadius: 9999,
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.light.background
            },
            user.id === id
              ? { left: "50%", transform: [{ translateX: -42 }] as any }
              : { left: 16 }
          ]}
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
