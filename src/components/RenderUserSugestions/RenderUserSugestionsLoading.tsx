import { Colors } from "@/constants/colors";
import { Loading } from "../Loading";
import { View } from "../Themed";

export function RenderUserSugestionsLoading() {
  return (
    <View
      style={{
        backgroundColor: Colors.light.white,
        borderBottomWidth: 1,
        borderColor: Colors.light.periwinkle,
        display: "flex",
        gap: 8,
        padding: 12,
        width: "100%"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Loading width={18} height={18} borderRadius={9999} />
        <Loading width={150} height={13.33} borderRadius={8} />
      </View>
    </View>
  );
}
