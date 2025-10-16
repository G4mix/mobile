import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/colors";
import { InView } from "../InView";
import { IdeaImages } from "./IdeaImages";
import { IdeaHeader } from "./IdeaHeader";
import { IdeaBody } from "./IdeaBody";

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
  ideaContainer: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: Colors.light.periwinkle,
    display: "flex",
    flex: 1,
    gap: 8,
    minHeight: Dimensions.get("window").height * 0.75,
    width: "100%"
  },
  cardShadowWrapper: {
    alignSelf: "center",       
    borderRadius: 16,         
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    elevation: 4,
  }
});

export function Idea({ alreadyVisualized, idea, onInView }: IdeaProps) {
  // const [isDeleting, setIsDeleting] = useState(false);
  // if (isDeleting) return <IdeaLoading />;
  if (!idea) return null;
  return (
    <View style={styles.ideaContainer}>
      {/* <IdeaHeader
        ideaId={idea.id}
        author={idea.author}
        createdAt={idea.createdAt}
        updatedAt={idea.updatedAt}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
      /> */}
      <View style={styles.cardShadowWrapper}>
        
          <IdeaImages images={idea.images} />
          <IdeaBody
            author={idea.author.displayName}
            title={idea.title}
            content={idea.content}
            images={idea.images}
            tags={idea.tags}
          />
          {/* {idea.links.map((link) => (
            <IdeaLink key={`link-${link}`} url={link} />
          ))}
          <IdeaActions
            ideaId={idea.id}
            likes={idea.likes}
            comments={idea.comments}
            views={idea.views}
            liked={idea.isLiked}
            viewed={false}
          /> */}
        
      </View>
      {!alreadyVisualized && onInView && <InView onInView={onInView} />}
    </View>
  );
}
