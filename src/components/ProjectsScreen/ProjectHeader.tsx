import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { styles as projectItemStyles } from "./ProjectItem";

export function ProjectHeader({
  title,
  icon,
  backgroundImage,
  onPressBackground,
  onPressIcon,
}: {
  title: string;
  icon?: string | null;
  backgroundImage?: string | null;
  onPressBackground?: () => void;
  onPressIcon?: () => void;
}) {
  const firstLetter = title.charAt(0).toUpperCase();
  const EditableComponent = onPressBackground ? TouchableOpacity : View;

  return (
    <View
      style={{
        width: "100%",
        position: "relative",
        gap: 28,
        marginBottom: 24,
      }}
    >
      <EditableComponent
        style={{
          width: "100%",
          minHeight: 140,
          backgroundColor: Colors.light.periwinkle,
          borderRadius: 16,
          position: "relative",
        }}
        onPress={onPressBackground}
      >
        {onPressBackground && (
          <Icon
            name="pencil"
            size={16}
            color={Colors.light.white}
            style={{ position: "absolute", right: 12, top: 12, zIndex: 2 }}
          />
        )}
        {backgroundImage ? (
          <Image
            source={{ uri: getImgWithTimestamp(backgroundImage) }}
            style={{
              width: "100%",
              minHeight: 140,
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              projectItemStyles.backgroundText,
              {
                padding: 20,
                textAlign: "center",
              },
            ]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Text>
        )}
      </EditableComponent>
      {icon ? (
        <EditableComponent
          style={[
            projectItemStyles.iconContainer,
            {
              position: "absolute",
              bottom: -16,
              left: 16,
            },
          ]}
          onPress={onPressIcon}
        >
          {onPressIcon && (
            <Icon
              name="pencil"
              size={16}
              color={Colors.light.white}
              style={{ position: "absolute", right: 12, top: 12, zIndex: 2 }}
            />
          )}
          <Image
            source={{ uri: getImgWithTimestamp(icon) }}
            style={projectItemStyles.iconImage}
          />
        </EditableComponent>
      ) : (
        <EditableComponent
          style={[
            projectItemStyles.iconContainer,
            projectItemStyles.iconContainerNoImage,
            {
              position: "absolute",
              bottom: -16,
              left: 16,
            },
          ]}
          onPress={onPressIcon}
        >
          {onPressIcon && (
            <Icon
              name="pencil"
              size={16}
              color={Colors.light.white}
              style={{ position: "absolute", right: 12, top: 12, zIndex: 2 }}
            />
          )}
          <Text style={projectItemStyles.iconText}>{firstLetter}</Text>
        </EditableComponent>
      )}
    </View>
  );
}
