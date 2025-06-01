import { getDate } from "./getDate";

export const getImgWithTimestamp = (uri?: string) => {
  const timestamp = getDate().toISOString();
  return uri ? `${uri}?v=${timestamp}` : undefined;
};
