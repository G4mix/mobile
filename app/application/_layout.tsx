import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps
} from "expo-router/ui";
import { Pressable, StyleSheet, View } from "react-native";

import { Href } from "expo-router";
import { Colors } from "@/constants/colors";

interface TabBarIconProps extends React.PropsWithChildren, TabTriggerSlotProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  size: number;
}

const TabBarIcon = React.forwardRef<View, TabBarIconProps>((props, ref) => (
  <Pressable
    ref={ref}
    {...props}
    style={{
      width: props.size,
      height: props.size,
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <FontAwesome
      size={props.size}
      name={props.name}
      color={
        props.isFocused
          ? Colors.light.majorelleBlue
          : Colors.light.russianViolet
      }
    />
  </Pressable>
));

const styles = StyleSheet.create({
  tabList: {
    alignItems: "center",
    backgroundColor: "white",
    borderTopColor: Colors.light.russianViolet,
    borderTopWidth: 1,
    bottom: 0,
    display: "flex",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: 32,
    paddingVertical: 16,
    position: "absolute",
    right: 0,
    width: "100%"
  },
  tabTrigger: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});

export default function TabLayout() {
  const tabs: {
    name: string;
    href: Href;
    iconName: React.ComponentProps<typeof FontAwesome>["name"];
    size: number;
  }[] = [
    {
      name: "feed",
      href: "/application/feed",
      iconName: "home",
      size: 28
    },
    {
      name: "search",
      href: "/application/search",
      iconName: "search",
      size: 24
    },
    {
      name: "create",
      href: "/application/create",
      iconName: "plus-circle",
      size: 28
    },
    {
      name: "team",
      href: "/application/team",
      iconName: "users",
      size: 24
    },
    {
      name: "profile",
      href: "/application/profile",
      iconName: "user-circle",
      size: 24
    }
  ];
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        {tabs.map(({ name, href, iconName, size }) => (
          <TabTrigger
            key={`tab-${href}`}
            name={name}
            href={href}
            style={styles.tabTrigger}
            asChild
          >
            <TabBarIcon name={iconName} size={size} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
