import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { View } from "../Themed";
import { Icon, IconName } from "../Icon";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  postContentActionDisabled: {
    opacity: 0.4
  },
  postContentActions: {
    alignContent: "center",
    backgroundColor: Colors.light.majorelleBlue,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: Colors.light.tropicalIndigo,
    borderTopWidth: 2,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    padding: 16,
    width: "100%"
  }
});

type CreateScreenContentActionsProps = {
  postContentActions: { name: IconName; handleClick?: () => void }[];
  style?: StyleProp<ViewStyle>;
};

export function CreateScreenContentActions({
  postContentActions,
  style={}
}: CreateScreenContentActionsProps) {
  return (
    <View style={[styles.postContentActions, style]}>
      {postContentActions.map((postContentAction) =>
        postContentAction.handleClick ? (
          <TouchableOpacity
            onPress={postContentAction.handleClick}
            key={`post-content-action-${postContentAction.name}`}
          >
            <Icon name={postContentAction.name} size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <Icon
            key={`post-content-action-${postContentAction.name}`}
            name={postContentAction.name}
            size={20}
            color="white"
            style={styles.postContentActionDisabled}
          />
        )
      )}
    </View>
  );
}
