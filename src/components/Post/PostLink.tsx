import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { ExternalLink } from "@/components/ExternalLink";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  link: {
    alignItems: "center",
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    position: "relative"
  },
  linkImage: {
    borderRadius: 8,
    height: 66,
    objectFit: "cover",
    width: 66
  },
  linkInformations: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 8
  }
});

type PostLinkProps = {
  handleError?: () => void;
  children?: React.ReactNode;
  url?: string;
};

type DataType = {
  description: string;
  title: string;
  icon: {
    url: string;
    width: number;
    height: number;
  };
};

export function PostLink({ url = "", handleError, children }: PostLinkProps) {
  const [data, setData] = useState<DataType | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const { data: jsonData } = await response.json();

      setData({
        title: jsonData.title,
        description: jsonData.description,
        icon: {
          url: jsonData.logo.url,
          width: jsonData.logo.width,
          height: jsonData.logo.height
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (handleError) handleError();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (!data || !data.icon.url) return <Text>Carregando...</Text>;

  return (
    <ExternalLink
      style={{ width: "100%", padding: 16 }}
      href={url}
      aria-label={`Link para o site: ${data.title}`}
      target="_blank"
    >
      <View style={styles.link}>
        <Image
          src={data.icon.url || ""}
          width={data.icon.width}
          height={data.icon.height}
          alt={`Ícone do site: ${data.title}`}
          style={styles.linkImage}
        />
        <View style={styles.linkInformations}>
          <Text
            style={{
              fontWeight: "medium",
              color: Colors.light.majorelleBlue,
              fontSize: 12
            }}
          >
            {data.title.slice(0, 32)}...
          </Text>
          <Text
            style={{
              fontWeight: "regular",
              textAlign: "justify",
              color: Colors.light.majorelleBlue,
              fontSize: 12
            }}
          >
            {data.description.slice(0, 90)}...
          </Text>
        </View>
        {children}
      </View>
    </ExternalLink>
  );
}
