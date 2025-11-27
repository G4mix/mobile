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
      const statuses = {
        400: messages.BAD_REQUEST,
        401: messages.UNAUTHORIZED,
        403: messages.FORBIDDEN,
        404: messages.NOT_FOUNDED_DATA,
        409: messages.CONFLICT,
        413: messages.EXCEEDED_MAX_SIZE,
        422: messages.UNPROCESSABLE_ENTITY,
        429: messages.TOO_MANY_REQUESTS,
        500: messages.INTERNAL_SERVER_ERROR,
        503: messages.SERVICE_UNAVAILABLE,
      };
      if (!errorMessage) {
        errorMessage = statuses[status as keyof typeof statuses];
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
