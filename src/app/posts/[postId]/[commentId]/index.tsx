import { View, ScrollView } from "react-native";
import { useRef } from "react";
import { Comment } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";

export default function RepliesScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments();
  const comments = data?.pages?.flatMap((page) => page?.data || []) || [];
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View>
      <View>
        {comments.map((comment) => (
          <Comment key={`comment-${comment.id}`} comment={comment} />
        ))}
        {isFetchingNextPage || !hasNextPage ? null : (
          <InView onInView={fetchNextPage} scrollRef={scrollRef} />
        )}
      </View>
    </View>
  );
}
