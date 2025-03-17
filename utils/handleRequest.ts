import { ToastContextType } from "@/context/ToastContext";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

type RequestFunction<T> = () => Promise<T>;

export const handleRequest = async <T>({
  requestFn,
  showToast,
  setIsLoading,
  successMessage
}: {
  requestFn: RequestFunction<T>;
  showToast: ToastContextType['showToast'];
  successMessage?: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}): Promise<T | null> => {
  try {
    setIsLoading(true)
    const req = (await requestFn() as any).data;
    if (successMessage) showToast({ message: successMessage, color: "success" });
    setIsLoading(false)
    return req
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Ocorreu um erro inesperado.";
      showToast({ message: errorMessage, color: "warn" });
    } else {
      showToast({ message: "Erro ao tentar realizar a ação", color: "error", duration: 3000 });
    }
    setIsLoading(false)
    return null;
  }
}
