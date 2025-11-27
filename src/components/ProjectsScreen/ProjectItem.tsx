import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";
import { Icon } from "../Icon";

type ProjectItemProps = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  backgroundImage?: string;
  followersCount: number;
  ideasCount: number;
  topFollowers: { name: string; icon: string | null }[];
};

export const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: Colors.light.majorelleBlue,
    borderColor: Colors.light.white,
    borderRadius: 9999,
    borderWidth: 1.5,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  avatarImage: {
    borderRadius: 9999,
    height: 16,
    width: 16,
  },
  avatarText: {
    color: Colors.light.white,
    fontSize: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  avatarsContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  backgroundContainer: {
    alignItems: "center",
    backgroundColor: Colors.light.periwinkle,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "center",
    minHeight: 140,
    position: "relative",
    width: "100%",
  },
  backgroundImage: {
    height: 140,
    width: "100%",
  },
  backgroundText: {
    color: Colors.light.majorelleBlue,
    fontSize: 39.8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  content: {
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    color: Colors.light.jet,
    fontSize: 13.33,
    fontWeight: 400,
  },
  followersText: {
    color: Colors.light.silver,
    fontSize: 11.11,
    fontWeight: 400,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  footerIconContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  footerText: {
    color: Colors.light.jet,
    fontSize: 11.11,
    fontWeight: 400,
  },
  header: {
    gap: 12,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: Colors.light.russianViolet,
    borderRadius: 12,
    bottom: -16,
    height: 72,
    justifyContent: "center",
    left: 16,
    overflow: "hidden",
    position: "absolute",
    width: 72,
    zIndex: 100,
  },
  iconContainerNoImage: {
    bottom: -16,
    height: 72,
    width: 72,
  },
  iconImage: {
    height: 72,
    resizeMode: "cover",
    width: 72,
  },
  iconText: {
    color: Colors.light.majorelleBlue,
    fontSize: 32,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  root: {
    borderRadius: 16,
    gap: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  separator: {
    borderBottomColor: Colors.light.silver,
    borderBottomWidth: 1,
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: 700,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topFollowersContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
});

export function ProjectItem({
  id,
  title,
  description,
  icon,
  backgroundImage,
  followersCount,
  ideasCount,
  topFollowers,
}: ProjectItemProps) {
  const firstLetter = title.charAt(0).toUpperCase();

  return (
    <TouchableOpacity onPress={() => router.push(`/projects/${id}`)}>
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
    </TouchableOpacity>
  );
}
