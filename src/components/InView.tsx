import { useEffect, useRef } from "react";
import {
  View,
  useWindowDimensions,
  findNodeHandle,
  UIManager
} from "react-native";

type InViewProps = {
  onInView: () => void;
};

export function InView({ onInView }: InViewProps) {
  const viewRef = useRef<View>(null);
  const calledRef = useRef(false);
  const { height: windowHeight } = useWindowDimensions();

  const checkIfInView = () => {
    if (!viewRef.current) return;

    const nodeHandle = findNodeHandle(viewRef.current);
    if (!nodeHandle) return;

    UIManager.measureInWindow(nodeHandle, (x, y, width, height) => {
      const isVisible = y >= 0 && y + height <= windowHeight;

      if (isVisible && !calledRef.current) {
        onInView();
        calledRef.current = true;
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkIfInView, 500);
    return () => clearInterval(interval);
  }, []);

  return <View ref={viewRef} style={{ height: 1 }} />;
}
