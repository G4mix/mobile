import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";
import { RootState } from "@/constants/reduxStore";
import { Button } from "@/components/Button";
import { CreateScreenPostLink } from "@/components/CreateScreen/CreateScreenPostLink";
import { CreateScreenCamera } from "@/components/CreateScreen/CreateScreenCamera";
import { timeout } from "@/utils/timeout";
import { objectToFormData } from "@/utils/objectToFormData";
import { useToast } from "@/hooks/useToast";
import { isArrayEqual } from "@/utils/isArrayEqual";
import { handleRequest } from "@/utils/handleRequest";
import { setUser, UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";
import { setItem } from "@/constants/storage";
import { SpinLoading } from "@/components/SpinLoading";
import { SuccessModal } from "@/components/SuccessModal";
import { getDate } from "@/utils/getDate";

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minWidth: "auto",
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});

export type UpdateUserFormData = {
  displayName: string;
  icon: {
    uri: string;
    name: string;
    type: string;
  } | null;
  autobiography: string;
  backgroundImage: {
    uri: string;
    name: string;
    type: string;
  } | null;
  links: string[];
};

export default function ConfigProfileScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const addLinkRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [valueKey, setValueKey] = useState<
    "icon" | "backgroundImage" | undefined
  >();
  const date = getDate().toISOString();
  const { watch, setValue, handleSubmit } = useForm<UpdateUserFormData>({
    defaultValues: {
      displayName: user.userProfile.displayName || "",
      autobiography: user.userProfile.autobiography || "",
      backgroundImage: user.userProfile.backgroundImage
        ? {
            uri: user.userProfile.backgroundImage,
            name: `backgroundImage-${date}.${user.userProfile.backgroundImage.split(".").pop()?.split("?")[0] || "png"}`,
            type: `image/${user.userProfile.backgroundImage.split(".").pop()?.split("?")[0] || "png"}`
          }
        : null,

      icon: user.userProfile.icon
        ? {
            uri: user.userProfile.icon,
            name: `user-icon-${date}.${user.userProfile.icon.split(".").pop()?.split("?")[0] || "png"}`,
            type: `image/${user.userProfile.icon.split(".").pop()?.split("?")[0] || "png"}`
          }
        : null,
      links: user.userProfile.links.map((l) => l.url) || []
    }
  });

  const updateUser = async ({
    autobiography,
    backgroundImage,
    displayName,
    icon,
    links
  }: UpdateUserFormData) => {
    if (isLoading) return;
    if (
      user.userProfile.autobiography === autobiography &&
      user.userProfile.backgroundImage === backgroundImage?.uri &&
      user.userProfile.displayName === displayName &&
      user.userProfile.icon === icon?.uri &&
      isArrayEqual(
        user.userProfile.links.map((l) => l.url),
        links
      )
    ) {
      router.back();
      setIsLoading(false);
      return;
    }

    const formData = objectToFormData({
      autobiography,
      backgroundImage,
      displayName,
      icon,
      links
    });
    const data = await handleRequest<UserState>({
      requestFn: async () =>
        api.patch("/user", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }),
      showToast,
      setIsLoading
    });
    if (!data) return;

    dispatch(setUser(data));
    await setItem("user", JSON.stringify(data));
    queryClient.setQueryData(["user", user.id], data);

    setValue("autobiography", autobiography);
    setValue("backgroundImage", backgroundImage);
    setValue("icon", icon);
    setValue("displayName", displayName);
    setValue("links", links);

    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.back();
  };
  const onSubmit = handleSubmit(updateUser);

  const displayName = watch("displayName");
  const autobiography = watch("autobiography");
  const links = watch("links");
  const icon = watch("icon");
  const backgroundImage = watch("backgroundImage");

  const handlePressProfileBackground = () => {
    setValueKey("backgroundImage");
    setIsCameraVisible(true);
  };

  const handlePressProfileIcon = () => {
    setValueKey("icon");
    setIsCameraVisible(true);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {isLoading && <SpinLoading message="Atualizando perfil..." />}
      {isSuccessVisible && <SuccessModal message="Perfil atualizado!" />}
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 12
        }}
      >
        <View style={styles.header}>
          <Text style={{ fontSize: 16 }}>Editar Perfil</Text>
          <Button style={styles.button} onPress={onSubmit}>
            <Text style={{ color: Colors.light.white, fontSize: 16 }}>
              Salvar
            </Text>
          </Button>
        </View>
        <ProfileHeader
          id={user.id}
          icon={icon?.uri || ""}
          backgroundImage={backgroundImage?.uri || ""}
          onPressBackground={handlePressProfileBackground}
          onPressIcon={handlePressProfileIcon}
        />
        <Input
          placeholder={
            user.userProfile.displayName ||
            "Como quer que as pessoas te chamem?"
          }
          label="Nome de Usuário"
          labelColor={Colors.light.russianViolet}
          color={Colors.light.tropicalIndigo}
          borderWidth={2}
          value={displayName}
          onChangeText={(value) => setValue("displayName", value)}
        />
        <View style={{ gap: 4 }}>
          <Text
            style={{ fontWeight: "bold", color: Colors.light.russianViolet }}
          >
            Descrição
          </Text>
          <TextArea
            placeholder={
              user.userProfile.autobiography || "Conte-nos um pouco sobre você"
            }
            value={autobiography}
            onChangeText={(value) => setValue("autobiography", value)}
            style={{ minHeight: 136, color: Colors.light.tropicalIndigo }}
          />
        </View>
        <View style={{ gap: 4 }}>
          <Text
            style={{ fontWeight: "bold", color: Colors.light.russianViolet }}
          >
            Links
          </Text>
          <View style={{ gap: 8 }}>
            <Input
              placeholder="Adicione um link"
              color={Colors.light.tropicalIndigo}
              borderWidth={2}
              onSubmitEditing={(e) => {
                if (links && links.length >= 5) {
                  showToast({
                    message: "O limite de links é 5!",
                    color: "warn"
                  });
                  return;
                }
                const currentLinks = links || [];
                const url = e.nativeEvent.text.trim();
                if (url === "" || currentLinks.includes(url)) return;
                if (addLinkRef.current) (addLinkRef.current as any).clear();
                setValue("links", [...currentLinks, url]);
              }}
              returnKeyType="done"
              ref={addLinkRef}
            />
            {links?.map((link) => (
              <CreateScreenPostLink
                setValue={setValue as any}
                links={links}
                link={link}
                key={`post-link-${link}`}
                noHorizontalPadding
              />
            ))}
          </View>
        </View>
        <CreateScreenCamera
          isCameraVisible={isCameraVisible}
          setIsCameraVisible={setIsCameraVisible}
          setValue={setValue as any}
          valueKey={valueKey}
          singleImage
        />
      </View>
    </ScrollView>
  );
}
