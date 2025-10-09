export const getDate = (): Date => {
  const now = new Date();
  // Brasília = UTC-3 so we need to subtract 3 hours from UTC
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const brasiliaOffset = -3 * 60 * 60000;
  return new Date(utc + brasiliaOffset);
};
