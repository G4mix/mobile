export const formatDate = (createdAt: string, updatedAt?: string) => {
  const createdDate = new Date(createdAt);
  const updatedDate = updatedAt ? new Date(updatedAt) : null;

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
      "dez"
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);

    return `${day} ${month}. ${year}`;
  };

  const updated = updatedDate
    ? createdDate.getTime() !== updatedDate.getTime()
    : false;

  return `${updated ? "Editado em " : ""}${format(updated ? updatedDate! : createdDate)}`;
};
