const format = (date: Date) => {
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day} ${month}. ${year}`;
};

export const formatDate = (createdAt: string, updatedAt?: string) => {
  const createdDate = new Date(createdAt);
  const updatedDate = updatedAt ? new Date(updatedAt) : null;

  const updated = updatedDate
    ? createdDate.getTime() !== updatedDate.getTime()
    : false;

  return `${updated ? "Editado em " : ""}${format(updated ? updatedDate! : createdDate)}`;
};

export const formatEventDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatEventTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatFullDate = (isoString: string) => {
  const date = new Date(isoString);
  const weeklyDay = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
  })
    .format(date)
    .replace(".", "");
  return `${weeklyDay}, ${format(date)} ${formatEventTime(isoString)}`;
};
