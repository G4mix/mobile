import { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { ToastContextType } from "@/context/ToastContext";
import { messages } from "@/constants/messages";
import { ApiErrorResponse } from "@/types/apiErrors";

type RequestFunction<T> = () => Promise<T>;

export const handleRequest = async <T>({
  requestFn,
  showToast,
  setIsLoading,
  successMessage,
  ignoreErrors = false,
}: {
  requestFn: RequestFunction<T>;
  showToast: ToastContextType["showToast"];
  successMessage?: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  ignoreErrors?: boolean;
}): Promise<T | null> => {
  try {
    setIsLoading(true);
    const req = ((await requestFn()) as any).data;
    if (successMessage)
      showToast({ message: successMessage, color: "success" });
    setIsLoading(false);
    return req;
  } catch (error) {
    setIsLoading(false);
    if (ignoreErrors) return null;

    if (isAxiosError(error)) {
      const errorResponse = error.response?.data as ApiErrorResponse;
      const message = errorResponse?.message;
      const status = error.response?.status;

      let errorMessage = message ? messages[message] : undefined;

      if (!errorMessage) {
        switch (status) {
          case 400:
            errorMessage = messages.BAD_REQUEST;
            break;
          case 401:
            errorMessage = messages.UNAUTHORIZED;
            break;
          case 403:
            errorMessage = messages.FORBIDDEN;
            break;
          case 404:
            errorMessage = messages.NOT_FOUNDED_DATA;
            break;
          case 409:
            errorMessage = messages.CONFLICT;
            break;
          case 422:
            errorMessage = messages.UNPROCESSABLE_ENTITY;
            break;
          case 429:
            errorMessage = messages.TOO_MANY_REQUESTS;
            break;
          case 500:
            errorMessage = messages.INTERNAL_SERVER_ERROR;
            break;
          case 503:
            errorMessage = messages.SERVICE_UNAVAILABLE;
            break;
          default:
            errorMessage = "Ocorreu um erro inesperado.";
        }
      }

      showToast({ message: errorMessage, color: "warn" });
    } else {
      showToast({
        message: "Erro ao tentar realizar a ação",
        color: "error",
        duration: 3000,
      });
    }
    return null;
  }
};
