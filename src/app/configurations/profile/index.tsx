import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";
import { RootState } from "@/constants/reduxStore";
import { Button } from "@/components/Button";

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

export default function ConfigProfileScreen() {
  const user = useSelector((state: RootState) => state.user);

  return (
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
        <Button style={styles.button}>
          <Text style={{ color: Colors.light.white, fontSize: 16 }}>
            Salvar
          </Text>
        </Button>
      </View>
      <ProfileHeader
        id={user.id}
        icon={user.userProfile.icon}
        backgroundImage={user.userProfile.backgroundImage}
        disableControls
      />

      {/* 
      <View
        style={{
          borderRadius: 16,
          width: "100%",
          height: 100,
          backgroundColor: !data.userProfile.backgroundImage
            ? "#353535"
            : undefined
        }}
      >
        {data.userProfile.backgroundImage && (
          <Image
            source={{ uri: data.userProfile.backgroundImage }}
            style={{ width: "100%", height: 100 }}
            resizeMode="cover"
          />
        )}
        {data.userProfile.icon ? (
          <Image
            source={{ uri: data.userProfile.icon }}
            style={{
              ...styles.imageProfile,
              width: 80,
              height: 80,
              position: "absolute",
              top: 60,
              left: "50%",
              zIndex: 100,
              transform: [{ translateX: -40 }] as any
            }}
          />
        ) : (
          <View
            style={{
              position: "absolute",
              top: 50,
              left: "50%",
              zIndex: 2,
              transform: [{ translateX: -36 }] as any,
              borderRadius: 9999,
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              size={80}
              name="user-circle"
              color={Colors.light.majorelleBlue}
              style={{
                width: 80,
                height: 80
              }}
            />
          </View>
        )}
      </View> */}
      <Input
        placeholder="displayName"
        label="Nome de Usuário"
        color={Colors.light.majorelleBlue}
        labelColor={Colors.light.russianViolet}
      />
      <View style={{ gap: 4 }}>
        <Text style={{ fontWeight: "bold", color: Colors.light.russianViolet }}>
          Descrição
        </Text>
        <TextArea placeholder="descrição" style={{ minHeight: 136 }} />
      </View>
    </View>
  );
}
