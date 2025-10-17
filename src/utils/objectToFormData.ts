export const objectToFormData = (
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string,
): FormData => {
  const formData = form || new FormData();

  Object.entries(obj).forEach(([property, value]) => {
    const key = namespace ? `${namespace}[${property}]` : property;

    if (value) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        if (
          value.some(
            (e) =>
              e instanceof File ||
              e instanceof Blob ||
              (typeof e === "object" && e !== null),
          )
        ) {
          value.forEach((element) => {
            formData.append(key, element);
          });
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
