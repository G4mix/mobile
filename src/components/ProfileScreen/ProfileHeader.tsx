import { Image } from "react-native";
import { View } from "../Themed";

export function ProfileHeader() {
  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          height: 100
        }}
      >
        <Image
          source={require("../../assets/images/favicon.png")}
          style={{ width: "100%", height: 100 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}
