import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "../Themed";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Idea } from "../Idea";
import { IdeaLoading } from "../Idea/IdeaLoading";
import { InView } from "../InView";
import { useFeed } from "@/hooks/useFeed";
import { styles } from "@/app/(tabs)/feed";

export function ProfileIdeas({ userId }: { userId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed({
    authorId: userId
  });
  const ideas = data?.pages?.flatMap((page) => page?.data || []) || [];

  return (
    <View style={styles.ideas}>
      <FloatingOptionsProvider>
        <ConfirmationModalProvider>
          {ideas?.map((idea, index) => (
            <TouchableOpacity
              onPress={() => router.push(`/ideas/${idea!.id}`)}
              key={`idea-${idea?.id || index}`}
            >
              <Idea
                idea={idea}
                // onInView={() => {
                //   if (idea) addVisualizedPost(idea.id);
                // }}
                // alreadyVisualized={
                //   idea ? alreadyVisualized.current.has(idea.id) : false
                // }
              />
            </TouchableOpacity>
          ))}
          {isFetchingNextPage &&
            [1, 2, 3].map((idea) => (
              <IdeaLoading key={`idea-loading-${idea}`} />
            ))}
          {isFetchingNextPage || !hasNextPage ? null : (
            <InView onInView={fetchNextPage} />
          )}
        </ConfirmationModalProvider>
      </FloatingOptionsProvider>
    </View>
  );
}
