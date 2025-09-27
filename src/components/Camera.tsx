import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode
} from "expo-camera";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Easing
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UseFormSetValue } from "react-hook-form";
import { Accelerometer } from "expo-sensors";
import { Icon } from "./Icon";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { getDate } from "@/utils/getDate";

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

export type CameraImage = {
  uri: string;
  name: string;
  type: string;
};

type CameraProps = {
  isCameraVisible: boolean;
  setIsCameraVisible: Dispatch<SetStateAction<boolean>>;
  setValue: UseFormSetValue<{ [key: string]: CameraImage | CameraImage[] }>;
  singleImage?: boolean;
  valueKey?: string;
  images?: CameraImage[];
};

export function Camera({
  isCameraVisible,
  setIsCameraVisible,
  setValue,
  valueKey = "images",
  singleImage = false,
  images
}: CameraProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const { showToast } = useToast();
  const cameraRef = useRef<CameraView>(null);
  const MAX_SIZE = 1_000_000;

  const rotation = useRef(new Animated.Value(0)).current;

  const rotateIcon = (orientation: string) => {
    let toValue = 0;
    switch (orientation) {
      case "landscape-left":
        toValue = -90;
        break;
      case "landscape-right":
        toValue = 90;
        break;
      case "portrait-upside-down":
        toValue = 180;
        break;
      default:
        toValue = 0;
    }
    Animated.timing(rotation, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(200);
    const subscription = Accelerometer.addListener(({ x, y }) => {
      let orientation = "portrait";

      if (Math.abs(x) > Math.abs(y)) {
        orientation = x > 0 ? "landscape-right" : "landscape-left";
      } else {
        orientation = y > 0 ? "portrait" : "portrait-upside-down";
      }

      rotateIcon(orientation);
    });

    return () => subscription.remove();
  }, [isCameraVisible]);

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
    if (images && images.length >= 8) {
      setIsCameraVisible(false);
      showToast({ message: "O máximo de imagens é 8.", color: "warn" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: !singleImage,
      quality: 1
    });

    if (result.canceled) return;

    const currentImages = images || [];

    const fileChecks = await Promise.all(
      result.assets.map(async (asset, i) => {
        if (asset.fileSize && asset.fileSize > MAX_SIZE) {
          showToast({
            message: `A imagem ${i + 1} é muito pesada.`,
            color: "warn"
          });
          return null;
        }

        return {
          uri: asset.uri,
          name: asset.fileName || getDate().toISOString(),
          type: asset.mimeType || "image/jpeg"
        };
      })
    );

    const validFiles = fileChecks.filter(Boolean);

    if (validFiles.length === 0) return;

    setValue(
      valueKey as any,
      (singleImage ? validFiles[0] : [...currentImages, ...validFiles]) as any
    );
    closeCamera();
  };

  const handleTakePhoto = async () => {
    if (images && images.length >= 8) {
      setIsCameraVisible(false);
      showToast({ message: "O máximo de imagens é 8.", color: "warn" });
      return;
    }
    const takedPhoto =
      (await cameraRef.current?.takePictureAsync()) as ImagePicker.ImagePickerAsset;
    const currentImages = images || [];
    const parsedTakedPhoto = {
      uri: takedPhoto.uri,
      name: takedPhoto.fileName || getDate().toISOString(),
      type: takedPhoto.mimeType || "image/jpeg"
    };
    try {
      const response = await fetch(takedPhoto.uri);
      const blob = await response.blob();
      if (blob.size > MAX_SIZE) {
        showToast({
          message: `A imagem é muito pesada.`,
          color: "warn"
        });
        closeCamera();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (_error) {}

    setValue(
      valueKey as any,
      singleImage ? parsedTakedPhoto : [...currentImages, parsedTakedPhoto]
    );
    closeCamera();
  };

  const changeFlash = () => {
    setFlash((oldFlash) =>
      oldFlash === "off" ? "on" : flash === "on" ? "auto" : "off"
    );
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-180, 180],
    outputRange: ["-180deg", "180deg"]
  });

  return (
    <Modal style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef as any}
        flash={flash}
      >
        <TouchableOpacity style={styles.closePhoto} onPress={closeCamera}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Icon size={24} name="x-mark" color="white" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changeFlashIcon} onPress={changeFlash}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
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
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickImageRoot} onPress={pickImageAsync}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Icon size={24} name="photo" color="white" />
          </Animated.View>
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
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Icon size={24} name="arrow-path" color="white" />
          </Animated.View>
        </TouchableOpacity>
      </CameraView>
    </Modal>
  );
}
