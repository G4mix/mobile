import { Colors } from "@/constants/colors";
import { Loading } from "../Loading";
import { View } from "../Themed";
import { Icon } from "../Icon";

export function IdeaLinkLoading({
  noHorizontalPadding,
}: {
  noHorizontalPadding?: boolean;
}) {
  return (
    <View
      style={{ width: "100%", paddingHorizontal: noHorizontalPadding ? 0 : 16 }}
    >
      <View
        style={{
          alignItems: "center",
          borderColor: Colors.light.tropicalIndigo,
          borderRadius: 8,
          borderStyle: "solid",
          borderWidth: 2,
          display: "flex",
          flexDirection: "row",
          gap: 8,
          padding: 12,
          backgroundColor: Colors.light.white,
          width: "100%",
        }}
      >
        <Loading
          width={66}
          height={66}
          borderRadius={8}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="photo" size={32} color={Colors.light.background} />
        </Loading>
        <View style={{ flexDirection: "column", gap: 4 }}>
          <Loading width={100} height={13.33} borderRadius={4} />
          <Loading width={230} height={13.33} borderRadius={4} />
          <Loading width={230} height={13.33} borderRadius={4} />
          <Loading width={230} height={13.33} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}
