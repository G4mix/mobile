import { getItem, setItem } from "@/constants/storage";

const IMAGE_VERSIONS_KEY = "imageVersions";

let imageVersionsCache: Record<string, number> | null = null;
let initializationPromise: Promise<void> | null = null;

const initializeCache = async (): Promise<void> => {
  if (imageVersionsCache !== null) return;

  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  initializationPromise = (async () => {
    try {
      const stored = await getItem(IMAGE_VERSIONS_KEY);
      imageVersionsCache = stored ? JSON.parse(stored) : {};
    } catch {
      imageVersionsCache = {};
    }
  })();

  await initializationPromise;
  initializationPromise = null;
};

const saveImageVersions = async (versions: Record<string, number>) => {
  imageVersionsCache = versions;
  try {
    await setItem(IMAGE_VERSIONS_KEY, JSON.stringify(versions));
  } catch {
    // error
  }
};

const getUrlHashSync = (url: string): string => {
  let hash = 0;
  for (let i = 0; i < url.length; i += 1) {
    const char = url.charCodeAt(i);
    hash = hash * 32 - hash + char;
  }
  return Math.abs(hash).toString(36).substring(0, 8);
};

export const getCachedImageUrl = (uri?: string): string | undefined => {
  if (!uri) return undefined;

  const baseUrl = uri.split("?")[0];

  if (imageVersionsCache === null) {
    initializeCache();
    const hash = getUrlHashSync(baseUrl);
    const version = parseInt(hash, 36) % 1000000;
    return `${baseUrl}?v=${version}`;
  }

  const version = imageVersionsCache[baseUrl] || 0;

  if (version === 0) {
    const hash = getUrlHashSync(baseUrl);
    const newVersion = parseInt(hash, 36) % 1000000;
    imageVersionsCache[baseUrl] = newVersion;
    saveImageVersions(imageVersionsCache);
    return `${baseUrl}?v=${newVersion}`;
  }

  return `${baseUrl}?v=${version}`;
};

export const invalidateImageCache = async (uri?: string) => {
  if (!uri) return;

  await initializeCache();
  if (!imageVersionsCache) return;

  const baseUrl = uri.split("?")[0];
  const currentVersion = imageVersionsCache[baseUrl] || 0;
  imageVersionsCache[baseUrl] = currentVersion + 1;
  await saveImageVersions(imageVersionsCache);
};

export const clearAllImageCache = async () => {
  imageVersionsCache = {};
  await setItem(IMAGE_VERSIONS_KEY, JSON.stringify({}));
};
