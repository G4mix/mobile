import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { InView } from "../InView";
import { IdeaBody } from "./IdeaBody";
import { IdeaActions } from "./IdeaActions";
import { getImgWithTimestamp } from "../../utils/getImgWithTimestamp";

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
  author: {
    id: string;
    displayName: string;
    autobiography: string | null;
    icon: string | null;
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
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  links: string[];
  tags: string[];
};

type IdeaProps = {
  alreadyVisualized?: boolean;
  idea?: IdeaType;
  onInView?: () => void;
};

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ideaContainer: {
    backgroundColor: "transparent",
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
});

export function Idea({ alreadyVisualized, idea, onInView }: IdeaProps) {
  // const [isDeleting, setIsDeleting] = useState(false);
  // if (isDeleting) return <IdeaLoading />;
  if (!idea) return null;
  return (
    <View style={styles.ideaContainer}>
      <Image
        source={{ uri: getImgWithTimestamp(idea.images[0].src) }}
        style={styles.image}
      />
      <LinearGradient
        colors={["rgba(0,0,0,.8)", "transparent"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0.6 }}
        end={{ x: 0.5, y: 0 }}
      />
      <View style={styles.overlayContainer}>
        <IdeaBody
          author={idea.author.displayName}
          title={idea.title}
          content={idea.content}
          images={idea.images}
          tags={idea.tags}
        />
        <IdeaActions
          ideaId={idea.id}
          likes={idea.likes}
          comments={idea.comments}
          liked={idea.isLiked}
        />
      </View>
      {!alreadyVisualized && onInView && <InView onInView={onInView} />}
    </View>
  );
}
