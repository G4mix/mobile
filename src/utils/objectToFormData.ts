const isReactNativeImageObject = (value: any): boolean =>
  typeof value === "object" &&
  value !== null &&
  typeof value.uri === "string" &&
  typeof value.name === "string" &&
  typeof value.type === "string";

export const objectToFormData = (
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string,
): FormData => {
  const formData = form || new FormData();

  Object.entries(obj).forEach(([property, value]) => {
    const key = namespace ? `${namespace}[${property}]` : property;

    if (value !== undefined && value !== null) {
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
              isReactNativeImageObject(e),
          )
        ) {
          value.forEach((element) => {
            formData.append(key, element);
          });
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else if (isReactNativeImageObject(value)) {
        formData.append(key, value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
