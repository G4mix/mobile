import { Colors } from "@/constants/colors";
import { Loading } from "../Loading";
import { View } from "../Themed";

export function CommentLoading({
  commentType
}: {
  commentType: "post" | "comment";
}) {
  return (
    <View
      style={{
        backgroundColor: Colors.light.white,
        borderBottomWidth: 1,
        borderColor: Colors.light.periwinkle,
        display: "flex",
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: commentType === "post" ? 16 : 36,
        width: "100%"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Loading width={18} height={18} borderRadius={9999} />
        <Loading width={120} height={13.33} borderRadius={8} />
      </View>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Loading width="100%" height={13.33} borderRadius={4} />
        <Loading width="100%" height={13.33} borderRadius={4} />
        <Loading width="100%" height={13.33} borderRadius={4} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Loading width={18} height={18} borderRadius={8} />
          <Loading width={20} height={13.33} borderRadius={8} />
        </View>
        <Loading width={80} height={18} borderRadius={8} />
      </View>
    </View>
  );
}
