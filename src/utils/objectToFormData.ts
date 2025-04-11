export const objectToFormData = (
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string
): FormData => {
  const formData = form || new FormData();

  Object.entries(obj).forEach(([property, value]) => {
    const key = namespace ? `${namespace}[${property}]` : property;

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
            (typeof e === "object" && e !== null)
        )
      ) {
        value.forEach((element) => {
          if (element instanceof File || element instanceof Blob) {
            formData.append(key, element);
          } else if (typeof element === "object" && element !== null) {
            objectToFormData(element, formData, key);
          } else {
            formData.append(key, String(element));
          }
        });
      } else {
        formData.append(key, String(value));
      }
    } else if (typeof value === "object" && value !== null) {
      objectToFormData(value, formData, key);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
