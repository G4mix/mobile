import { useSelector } from "react-redux";
import { Colors } from "@/constants/colors";
import { Loading } from "../Loading";
import { Text, View } from "../Themed";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RootState } from "@/constants/reduxStore";

export function ProfileHeaderLoading({ id }: { id?: string }) {
  const user = useSelector((state: RootState) => state.user);
  const isOwnProfile = user.userProfile.id === id;
  return (
    <View
      style={{
        display: "flex",
        position: "relative",
        gap: 28,
        width: "100%",
        marginBottom: 12
      }}
    >
      {isOwnProfile ? (
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
              paddingVertical: 8,
              opacity: 0.7
            }}
          >
            <Text style={{ color: Colors.light.white }}>Editar</Text>
          </Button>
          <Icon
            size={24}
            name="cog-6-tooth"
            color={Colors.light.russianViolet}
            style={{
              width: 24,
              height: 24,
              opacity: 0.7
            }}
          />
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
          <Loading width={70} height={30} borderRadius={4} />
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
      )}
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Loading width="100%" height={100} borderRadius={0} />
      </View>
      <View
        style={{
          gap: 12,
          width: "100%"
        }}
      >
        <View
          style={[
            {
              zIndex: 3,
              backgroundColor: "transparent"
            },
            isOwnProfile ? { alignItems: "center" } : { paddingLeft: 16 }
          ]}
        >
          <Loading width={70} height={16} borderRadius={4} />
        </View>
        <View
          style={[
            {
              alignItems: "center",
              flexDirection: "row",
              gap: 16
            },
            isOwnProfile ? { justifyContent: "center" } : { paddingLeft: 16 }
          ]}
        >
          <View style={{ gap: 4, flexDirection: "row", alignItems: "center" }}>
            <Loading width={30} height={16} borderRadius={4} />
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
          <View style={{ gap: 4, flexDirection: "row", alignItems: "center" }}>
            <Loading width={30} height={16} borderRadius={4} />
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
      </View>
      <View
        style={[
          {
            position: "absolute",
            top: 50,
            zIndex: 2,
            borderRadius: 9999,
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center"
          },
          isOwnProfile
            ? { left: "50%", transform: [{ translateX: -36 }] as any }
            : { left: 16 }
        ]}
      >
        <Loading
          width={80}
          height={80}
          borderRadius={9999}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon name="photo" size={32} color={Colors.light.background} />
        </Loading>
      </View>
    </View>
  );
}
