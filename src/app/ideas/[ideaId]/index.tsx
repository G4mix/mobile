import { Link, router, useLocalSearchParams } from "expo-router";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { IdeaType } from "@/components/Idea";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { IdeaLoading } from "@/components/Idea/IdeaLoading";
import { CommentLoading } from "@/components/CommentsScreen/CommentLoading";
import { Colors } from "@/constants/colors";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { getImgWithTimestamp } from "../../../utils/getImgWithTimestamp";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Themed";
import { abbreviateNumber } from "../../../utils/abbreviateNumber";
import { debounce } from "../../../utils/debounce";
import { handleRequest } from "../../../utils/handleRequest";
import { useFeedQueries } from "../../../hooks/useFeedQueries";
import { useToast } from "../../../hooks/useToast";
import { Tag } from "../../../components/Tag";
import { Button } from "../../../components/Button";
import { IdeaLink } from "../../../components/Idea/IdeaLink";

const styles = StyleSheet.create({
  ideaBody: {
    gap: 32,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  ideaContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flex: 1,
    gap: 8,
    width: "100%",
  },
  ideaContent: {
    color: Colors.light.russianViolet,
    fontSize: 16,
  },
  ideaContentContainer: {
    gap: 16,
  },
  ideaContentHeader: {
    borderBottomWidth: 1,
    borderColor: Colors.light.majorelleBlue,
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: "bold",
    paddingBottom: 16,
  },
  ideaTitle: {
    color: Colors.light.majorelleBlue,
    fontSize: 23.03,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    height: 300,
    resizeMode: "cover",
    width: Dimensions.get("window").width * 1,
  },
  imageContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flex: 1,
    gap: 8,
    position: "relative",
  },
  likeContainer: {
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 32,
    bottom: 16,
    flexDirection: "row",
    gap: 4,
    left: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: "absolute",
  },
  links: {
    backgroundColor: "transparent",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "transparent",
  },
  tags: {
    backgroundColor: "transparent",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default function IdeaScreen() {
  const [replying, setReplying] = useState<{
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  }>({
    parentComment: "",
    toMark: "",
    author: undefined,
  });
  const [isVisible, setIsVisible] = useState(false);

  const { ideaId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const {
    data: idea,
    isLoading,
    isError,
    refetch: refetchIdea,
  } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId,
  });
  const [isLiked, setIsLiked] = useState(idea?.isLiked || false);
  const [currentLikesCount, setCurrentLikesCount] = useState(idea?.likes || 0);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useComments();
  const comments = data?.pages?.flatMap((page) => page?.data || []) || [];

  const commentReply = async (commentId: string) => {
    router.push(`/ideas/${ideaId}/comments/${commentId}`);
  };

  const handleRefresh = async () => {
    // Invalidar e refazer fetch da idea e seus comentários
    await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    await queryClient.invalidateQueries({
      queryKey: ["comments", { postId: ideaId }],
    });
    await refetchIdea();
    await refetchComments();
  };
  const { updateIdea } = useFeedQueries();
  const { showToast } = useToast();
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const likePostRequest = async (
    newIsLiked: boolean,
    newLikesCount: number,
  ) => {
    if (isLoadingLike) return;
    const response = await handleRequest({
      requestFn: async () =>
        api.post("/like", {
          targetLikeId: ideaId,
          likeType: "Idea",
        }),
      showToast,
      setIsLoading: setIsLoadingLike,
      ignoreErrors: true,
    });
    if (!response) return;
    updateIdea({
      id: ideaId as string,
      isLiked: newIsLiked,
      likes: newLikesCount,
    });
  };

  const debouncedLikePost = useRef(
    debounce(
      (newIsLiked: boolean, newLikesCount: number) =>
        likePostRequest(newIsLiked, newLikesCount),
      700,
    ),
  ).current;

  const likeColor = isLiked
    ? Colors.light.majorelleBlue
    : Colors.light.russianViolet;

  const likePost = async () => {
    setIsLiked((prevValue) => {
      const newValue = !prevValue;
      setCurrentLikesCount((prevCount) => {
        const newLikesCount = !prevValue ? prevCount + 1 : prevCount - 1;
        debouncedLikePost(newValue, newLikesCount);
        return newLikesCount;
      });
      return newValue;
    });
  };

  if (isError) router.push("/feed");

  const sharePost = async () => {
    try {
      await Share.share({
        title: "Olha só esse post do Gamix!",
        message: "Venha conferir esse novo post do Gamix comigo!",
        url: `https://g4mix.vercel.app/ideas/${idea?.id}`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToast({
        message: "Houve um erro ao tentar compartilhar o post!",
        color: "error",
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.light.background,
        }}
        refreshControl={refreshControl}
      >
        {isLoading && <IdeaLoading />}
        <FloatingOptionsProvider>
          <ConfirmationModalProvider>
            {idea && (
              <View style={styles.ideaContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: getImgWithTimestamp(idea.images[0]) }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    key="post-action-hand-thumb-up"
                    style={styles.likeContainer}
                    onPress={likePost}
                  >
                    <Icon size={24} name="hand-thumb-up" color={likeColor} />
                    {abbreviateNumber(currentLikesCount) && (
                      <Text
                        style={{
                          fontSize: 13.33,
                          color: likeColor,
                          fontWeight: "medium",
                        }}
                      >
                        {abbreviateNumber(currentLikesCount)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.ideaBody}>
                  <View style={{ gap: 24 }}>
                    <View style={{ gap: 12 }}>
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.ideaTitle}>{idea.title}</Text>
                        <TouchableOpacity
                          key="post-action-share"
                          onPress={sharePost}
                        >
                          <Icon size={24} name="share" />
                        </TouchableOpacity>
                      </View>
                      <Link
                        key={`user-profile-${idea.id}`}
                        href={`/profile/${idea.author.id}`}
                      >
                        <View
                          style={{
                            flex: 1,
                            gap: 6,
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Image
                            source={{
                              uri: getImgWithTimestamp(idea.author.icon),
                            }}
                            style={{
                              borderRadius: 9999,
                              height: 24,
                              width: 24,
                              borderWidth: 1,
                            }}
                          />
                          <Text
                            style={{
                              color: Colors.light.jet,
                              fontWeight: "500",
                            }}
                          >
                            Criado por{" "}
                            <Text
                              style={{
                                color: Colors.light.jet,
                                fontWeight: "400",
                              }}
                            >
                              @{idea.author.displayName}
                            </Text>
                          </Text>
                        </View>
                      </Link>
                    </View>
                    <View style={styles.tags}>
                      {idea.tags.map((tag) => (
                        <View key={`view-tag-${tag}`} style={styles.tag}>
                          <Tag
                            name={tag}
                            fontSize={13.33}
                            color={Colors.light.russianViolet}
                            style={{
                              borderRadius: 32,
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              backgroundColor: Colors.light.periwinkle,
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.ideaContentContainer}>
                    <Text style={styles.ideaContentHeader}>
                      Descrição do Projeto
                    </Text>
                    <Text style={styles.ideaContent}>{idea.content}</Text>
                    <View style={styles.links}>
                      {idea.links.map((url) => (
                        <IdeaLink key={`idea-link-${url}`} url={url} />
                      ))}
                    </View>
                  </View>
                  <Button
                    style={{
                      borderRadius: 20,
                      paddingVertical: 16,
                    }}
                  >
                    <Text
                      lightColor="white"
                      style={{ fontWeight: "700", fontSize: 16 }}
                    >
                      Quero Colaborar
                    </Text>
                  </Button>
                </View>
              </View>
            )}
          </ConfirmationModalProvider>
        </FloatingOptionsProvider>
        <View style={{ gap: 16, paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={styles.ideaContentHeader}>Comentários</Text>
          <View style={{ marginBottom: 56 }}>
            {comments.map((comment, index) => (
              <View
                key={`comment-${comment.id}`}
                style={{ paddingTop: index === 0 ? 0 : 16 }}
              >
                <Comment
                  comment={comment}
                  replying={replying}
                  commentReply={() => commentReply(comment.id)}
                  commentType="post"
                />
              </View>
            ))}
            {isFetchingNextPage &&
              [0, 1, 2].map((comment) => (
                <CommentLoading
                  key={`comment-loading-${comment}`}
                  commentType="comment"
                />
              ))}
            {isFetchingNextPage || !hasNextPage ? null : (
              <InView onInView={fetchNextPage} />
            )}
          </View>
        </View>
      </ScrollView>
      <CommentInput
        commentsCount={idea?.comments || 0}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        replying={replying}
        setReplying={setReplying}
      />
    </View>
  );
}
