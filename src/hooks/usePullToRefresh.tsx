import { useState, useCallback } from "react";
import { RefreshControl } from "react-native";

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  refreshing: externalRefreshing,
}: UsePullToRefreshProps) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing = externalRefreshing ?? internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setInternalRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setInternalRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="#6366f1" // Cor do loading spinner
      colors={["#6366f1"]} // Android
      progressBackgroundColor="#ffffff" // Android background
    />
  );

  return {
    refreshControl,
    refreshing,
    handleRefresh,
  };
};
