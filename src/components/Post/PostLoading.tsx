import { Colors } from "@/constants/colors";
import { Loading } from "../Loading";
import { View } from "../Themed";
import { Icon } from "../Icon";

export function PostLoading() {
  return (
    <View
      style={{
        backgroundColor: Colors.light.white,
        borderBottomWidth: 1,
        borderColor: Colors.light.periwinkle,
        display: "flex",
        gap: 8,
        padding: 16,
        width: "100%"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Loading width={18} height={18} borderRadius={9999} />
        <Loading width={200} height={13.33} borderRadius={8} />
      </View>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Loading width="100%" height={13.33} borderRadius={4} />
        <Loading width="100%" height={13.33} borderRadius={4} />
        <Loading
          width="100%"
          height={200}
          borderRadius={8}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon name="photo" size={64} color={Colors.light.background} />
        </Loading>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Loading width={18} height={18} borderRadius={8} />
          <Loading width={20} height={13.33} borderRadius={8} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Loading width={18} height={18} borderRadius={8} />
          <Loading width={20} height={13.33} borderRadius={8} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Loading width={18} height={18} borderRadius={8} />
          <Loading width={20} height={13.33} borderRadius={8} />
        </View>
        <Loading width={18} height={18} borderRadius={8} />
      </View>
    </View>
  );
}
