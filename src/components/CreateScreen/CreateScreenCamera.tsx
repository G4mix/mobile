import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode
} from "expo-camera";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UseFormSetValue } from "react-hook-form";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { CreateScreenFormData } from "@/app/(tabs)/create";

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  changeFlashIcon: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 9999,
    padding: 12,
    position: "absolute",
    right: 24,
    top: 24
  },
  closePhoto: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 9999,
    left: 24,
    padding: 12,
    position: "absolute",
    top: 24
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  photoFlip: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 9999,
    bottom: 48,
    padding: 16,
    position: "absolute",
    right: 48
  },
  pickImageRoot: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 9999,
    bottom: 48,
    left: 48,
    padding: 16,
    position: "absolute"
  },
  printButton: {
    backgroundColor: "white",
    borderRadius: 9999,
    height: 50,
    width: 50
  },
  printButtonContent: {
    alignItems: "center",
    alignSelf: "flex-end",
    borderColor: "white",
    borderRadius: 9999,
    borderWidth: 6,
    padding: 8
  },
  printButtonRoot: {
    alignSelf: "center",
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    margin: 48
  }
});

type CreateScreenCameraProps = {
  isCameraVisible: boolean;
  setIsCameraVisible: Dispatch<SetStateAction<boolean>>;
  setValue: UseFormSetValue<CreateScreenFormData>;
  images?: ImagePicker.ImagePickerAsset[];
};

export function CreateScreenCamera({
  isCameraVisible,
  setIsCameraVisible,
  setValue,
  images
}: CreateScreenCameraProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  if (!isCameraVisible) return null;
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    requestPermission();
    return null;
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const closeCamera = async () => {
    setIsCameraVisible(false);
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1
    });

    if (result.canceled) return;

    const currentImages = images || [];
    setValue("images", [...currentImages, ...result.assets]);
    closeCamera();
  };

  const handleTakePhoto = async () => {
    const takedPhoto = await cameraRef.current?.takePictureAsync();
    const currentImages = images || [];
    setValue("images", [...currentImages, takedPhoto]);
    closeCamera();
  };

  const changeFlash = () => {
    setFlash((oldFlash) =>
      oldFlash === "off" ? "on" : flash === "on" ? "auto" : "off"
    );
  };

  return (
    <Modal style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef as any}
        flash={flash}
      >
        <TouchableOpacity style={styles.closePhoto} onPress={closeCamera}>
          <Icon size={24} name="x-mark" color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.changeFlashIcon} onPress={changeFlash}>
          <Icon
            size={24}
            name={
              flash === "off"
                ? "bolt-disabled"
                : flash === "on"
                  ? "bolt-enabled"
                  : "bolt-auto-enabled"
            }
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickImageRoot} onPress={pickImageAsync}>
          <Icon size={24} name="photo" color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.printButtonRoot}
          onPress={handleTakePhoto}
        >
          <View style={styles.printButtonContent}>
            <View style={styles.printButton} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoFlip} onPress={toggleCameraFacing}>
          <Icon size={24} name="arrow-path" color="white" />
        </TouchableOpacity>
      </CameraView>
    </Modal>
  );
}
