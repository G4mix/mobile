import { RefObject, useEffect, useRef } from "react";
import {
  View,
  useWindowDimensions,
  ScrollView,
  findNodeHandle,
  UIManager
} from "react-native";

type InViewProps = {
  onInView: () => void;
  scrollRef: RefObject<ScrollView>;
};

export function InView({ onInView, scrollRef }: InViewProps) {
  const viewRef = useRef<View>(null);
  const calledRef = useRef(false);
  const { height: windowHeight } = useWindowDimensions();

  const checkIfInView = () => {
    if (!viewRef.current || !scrollRef.current) return;

    const nodeHandle = findNodeHandle(viewRef.current);
    if (!nodeHandle) return;

    UIManager.measureLayout(
      nodeHandle,
      findNodeHandle(scrollRef.current) as number,
      () => {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      (_x, y, _width, _height) => {
        if (y >= 0 && y < windowHeight && !calledRef.current) {
          calledRef.current = true;
          onInView();
        }
      }
    );
  };

  useEffect(() => {
    const interval = setInterval(checkIfInView, 500);
    return () => clearInterval(interval);
  }, []);

  return <View ref={viewRef} style={{ height: 1 }} />;
}
