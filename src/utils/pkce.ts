import * as Crypto from "expo-crypto";

export const generateCodeVerifier = async () => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const generateCodeChallenge = async ({
  codeVerifier
}: {
  codeVerifier: string;
}) => {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  return hashed.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};
