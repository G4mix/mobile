import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { useToast } from "@/hooks/useToast";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";
import { RootState } from "@/constants/reduxStore";

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: Colors.light.periwinkle,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarImage: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  avatarText: {
    color: Colors.light.majorelleBlue,
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    padding: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  memberInfo: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  memberItem: {
    alignItems: "center",
    borderBottomColor: Colors.light.silver,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  memberName: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: "bold",
  },
});

type Member = {
  id: string;
  displayName: string;
  icon: string | null;
};

export function ProjectMembersModal({
  isVisible,
  setIsVisible,
  projectId,
  members,
  onMemberRemoved,
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  projectId: string;
  members: Member[];
  onMemberRemoved: () => void;
}) {
  const { showToast } = useToast();
  const { showConfirmationModal } = useConfirmationModal();
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const filteredMembers = members.filter(
    (member) => member.id !== currentUserId,
  );

  const handleRemoveMember = (memberId: string, memberName: string) => {
    showConfirmationModal({
      actionName: "Remover",
      title: "Remover membro",
      content: `Tem certeza que deseja remover ${memberName} do projeto?`,
      handleConfirm: async () => {
        setRemovingMemberId(memberId);
        const result = await handleRequest({
          requestFn: async () =>
            api.delete(`/project/${projectId}/member/${memberId}`),
          showToast,
          setIsLoading: () => {},
        });

        if (result !== null) {
          onMemberRemoved();
          setIsVisible(false);
        }
        setRemovingMemberId(null);
      },
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Membros do Projeto</Text>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <Icon
                    name="x-mark"
                    size={24}
                    color={Colors.light.russianViolet}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {filteredMembers.map((member) => {
                  const firstLetter = member.displayName
                    .charAt(0)
                    .toUpperCase();
                  const isRemoving = removingMemberId === member.id;

                  return (
                    <View key={member.id} style={styles.memberItem}>
                      <View style={styles.memberInfo}>
                        {member.icon ? (
                          <Image
                            source={{ uri: getCachedImageUrl(member.icon) }}
                            style={styles.avatarImage}
                            cachePolicy="memory-disk"
                            contentFit="cover"
                          />
                        ) : (
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{firstLetter}</Text>
                          </View>
                        )}
                        <Text style={styles.memberName}>
                          {member.displayName}
                        </Text>
                      </View>
                      {isRemoving ? (
                        <ActivityIndicator
                          size="small"
                          color={Colors.light.majorelleBlue}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveMember(member.id, member.displayName)
                          }
                        >
                          <Icon
                            name="x-mark"
                            size={20}
                            color={Colors.light.red}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
