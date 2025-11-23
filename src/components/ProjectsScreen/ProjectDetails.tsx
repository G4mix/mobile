import { Image } from "react-native";
import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";
import { styles } from "./ProjectItem";
import { Icon } from "../Icon";

type ProjectDetailsProps = {
  title: string;
  description: string;
  icon?: string;
  backgroundImage?: string;
  followersCount: number;
  ideasCount: number;
  topFollowers: { name: string; icon: string | null }[];
};

export function ProjectDetails({
  title,
  description,
  icon,
  backgroundImage,
  followersCount,
  ideasCount,
  topFollowers,
}: ProjectDetailsProps) {
  const firstLetter = title.charAt(0).toUpperCase();

  return (
    <View style={styles.root}>
      <View style={styles.backgroundContainer}>
        {icon ? (
          <View style={styles.iconContainer}>
            <Image source={{ uri: icon }} style={styles.iconImage} />
          </View>
        ) : (
          <View style={[styles.iconContainer, styles.iconContainerNoImage]}>
            <Text style={styles.iconText}>{firstLetter}</Text>
          </View>
        )}
        {backgroundImage ? (
          <Image
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={styles.backgroundText}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Icon
              name="ellipsis-vertical"
              size={24}
              style={styles.ellipsisVertical}
            />
          </View>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
          {topFollowers && topFollowers.length > 0 && (
            <View style={styles.topFollowersContainer}>
              <View style={styles.avatarsContainer}>
                {topFollowers.slice(0, 3).map((follower, mapIndex) => {
                  const position = mapIndex;
                  return (
                    <View
                      key={`follower-${follower.name}-${position}`}
                      style={[
                        styles.avatar,
                        {
                          backgroundColor: "#D9D9D9",
                          marginLeft: position > 0 ? -4 : 0,
                          zIndex: 3 - position,
                        },
                      ]}
                    >
                      {follower.icon ? (
                        <Image
                          source={{ uri: follower.icon }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {follower.name?.charAt(0)?.toUpperCase() || "?"}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
              {topFollowers[0] && (
                <Text style={styles.followersText}>
                  {topFollowers[0].name} e mais {followersCount - 1} seguem
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={styles.separator} />
        <View style={styles.footer}>
          <View style={styles.footerIconContainer}>
            <Icon name="light-bulb" size={16} color={Colors.light.jet} />
            <Text style={styles.footerText}>{ideasCount} ideias</Text>
          </View>
          <View style={styles.footerIconContainer}>
            <Icon name="users" size={16} color={Colors.light.jet} />
            <Text style={styles.footerText}>{followersCount} seguidores</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
