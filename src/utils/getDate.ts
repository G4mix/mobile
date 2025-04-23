export const getDate = (): Date => {
  const now = new Date();
  // Brasília = UTC-3, então precisamos subtrair 3 horas de UTC
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const brasiliaOffset = -3 * 60 * 60000;
  return new Date(utc + brasiliaOffset);
};
