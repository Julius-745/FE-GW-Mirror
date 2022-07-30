import { useQuery, useMutation } from "react-query";
import { httpClient } from "./httpClient";

export interface IPaymentMethod {
  id: number;
  title: string;
  enabled: boolean;
  description: string;
  accountNumber: string;
  accountNumberSecondary: string;
  imageUrl?: string;
}

export const usePaymentMethodListQuery = () => {
  return useQuery(
    "payment-methods",
    async () => {
      const { data } = await httpClient.get<IPaymentMethod[]>(
        "/payment-method"
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useCreatePaymentMethodMutation = () => {
  return useMutation(
    "payment-method-create",
    async (data: Omit<IPaymentMethod, "id">) => {
      const res = await httpClient.post("/payment-method", data);
      return res.data;
    }
  );
};

export const useEditPaymentMethodMutation = () => {
  return useMutation("payment-method-edit", async (data: IPaymentMethod) => {
    const { id, ...rest } = data;
    const res = await httpClient.put(`/payment-method/${id}`, rest);
    return res.data;
  });
};
