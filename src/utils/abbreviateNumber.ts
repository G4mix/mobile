export const abbreviateNumber = (value: number): string => {
  if (value < 1000) return value.toString();

  const suffixes = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(value) / 3);

  const suffix = suffixes[tier] || "";
  const scale = 10 ** (tier * 3);
  const scaled = value / scale;

  const formatted = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);

  return `${formatted}${suffix}`;
};
