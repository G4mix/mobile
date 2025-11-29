import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { InView } from "../InView";
import { IdeaBody } from "./IdeaBody";
import { IdeaActions } from "./IdeaActions";
import { getCachedImageUrl } from "../../utils/getCachedImageUrl";

export type IdeaType = {
  id: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isViewed: boolean;
  hasPendingCollaborationRequest?: boolean;
  isProjectMember?: boolean;
  author: {
    id: string;
    displayName: string;
    autobiography: string | null;
    icon: string;
    backgroundImage: string | null;
    links: string[];
    isFollowing: boolean;
    followers: number;
    following: number;
    user: {
      id: string;
      username: string;
      email: string;
      verified: boolean;
    };
  };
  images: string[];
  links: string[];
  tags: string[];
};

type IdeaProps = {
  alreadyVisualized?: boolean;
  idea?: IdeaType;
  onInView?: () => void;
  short?: boolean;
};

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ideaContainer: {
    backgroundColor: "black",
    display: "flex",
    flex: 1,
    gap: 8,
    minHeight: Dimensions.get("window").height * 0.75,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width * 1,
  },
  overlayContainer: {
    bottom: 0,
    gap: 16,
    left: 0,
    padding: 16,
    position: "absolute",
    right: 0,
  },
  shortIdeaContainer: {
    minHeight: 290,
  },
});

export function Idea({
  alreadyVisualized,
  idea,
  onInView,
  short = false,
}: IdeaProps) {
  // const [isDeleting, setIsDeleting] = useState(false);
  // if (isDeleting) return <IdeaLoading />;
  if (!idea) return null;
  const firstImage =
    idea.images && idea.images.length > 0 ? idea.images[0] : null;
  return (
    <View style={[styles.ideaContainer, short && styles.shortIdeaContainer]}>
      {firstImage && (
        <Image
          source={{ uri: getCachedImageUrl(firstImage) }}
          style={[styles.image, !short ? { maxHeight: "78%" } : {}]}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      )}
      <LinearGradient
        colors={["rgba(0,0,0,.8)", "transparent"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0.9 }}
        end={{ x: 0.5, y: 0 }}
      />
      <View style={styles.overlayContainer}>
        <IdeaBody
          author={idea.author.displayName}
          title={idea.title}
          content={idea.content}
          tags={idea.tags}
          short={short}
        />
        {!short && (
          <IdeaActions
            ideaId={idea.id}
            likes={idea.likes}
            comments={idea.comments}
            liked={idea.isLiked}
            authorId={idea.author.id}
            hasPendingCollaborationRequest={idea.hasPendingCollaborationRequest}
            isProjectMember={idea.isProjectMember}
          />
        )}
      </View>
      {!alreadyVisualized && onInView && <InView onInView={onInView} />}
    </View>
  );
}
