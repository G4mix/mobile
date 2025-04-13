import React from "react";
import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps
} from "expo-router/ui";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Href } from "expo-router";
import { Colors } from "@/constants/colors";
import { Icon, IconName } from "@/components/Icon";

interface TabBarIconProps extends React.PropsWithChildren, TabTriggerSlotProps {
  name: IconName;
  size: number;
  style?: StyleProp<ViewStyle>;
}

const TabBarIcon = React.forwardRef<View, TabBarIconProps>((props, ref) => (
  <Pressable
    ref={ref}
    {...props}
    style={[
      {
        width: props.size,
        height: props.size,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      },
      props.style || {}
    ]}
  >
    <Icon
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

const queryClient = new QueryClient();

export default function TabLayout() {
  const tabs: {
    name: string;
    href: Href;
    iconName: IconName;
    size: number;
    disabled?: boolean;
  }[] = [
    {
      name: "feed",
      href: "/feed",
      iconName: "home",
      size: 28
    },
    {
      name: "search",
      href: "/search",
      iconName: "magnifying-glass",
      size: 24,
      disabled: true
    },
    {
      name: "create",
      href: "/create",
      iconName: "plus-circle",
      size: 28
    },
    {
      name: "team",
      href: "/team",
      iconName: "user-group",
      size: 24,
      disabled: true
    },
    {
      name: "profile",
      href: "/profile",
      iconName: "user-circle",
      size: 24
    }
  ];
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <TabSlot />
        <TabList style={styles.tabList}>
          {tabs.map(({ name, href, iconName, size, disabled }) => (
            <TabTrigger
              key={`tab-${href}`}
              name={name}
              href={href}
              disabled={disabled}
              style={[styles.tabTrigger, disabled ? { opacity: 0.5 } : {}]}
              asChild
            >
              <TabBarIcon name={iconName} size={size} />
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>
    </QueryClientProvider>
  );
}
