import { getDate } from "./getDate";

export const getImgWithTimestamp = (uri?: string) => {
  const date = getDate();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const timestamp = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}_${pad(date.getHours())}:${pad(date.getMinutes())}`;

  return uri ? `${uri}?v=${timestamp}` : undefined;
};
