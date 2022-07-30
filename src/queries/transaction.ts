import { useQuery, useMutation } from "react-query";
import { httpClient } from "./httpClient";
import { Pagination } from "./pagination";
import { Type, Static } from "@sinclair/typebox";

export const PaymentMethod = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  enabled: Type.Boolean({ default: true }),
  description: Type.String(),
  accountNumber: Type.String(),
  accountNumberSecondary: Type.Optional(Type.String()),
  imageUrl: Type.String(),
});

const Transaction = Type.Object({
  id: Type.Number(),
  donatur: Type.Object({
    id: Type.Number(),
    name: Type.String(),
    address: Type.Optional(Type.String()),
    phoneNumber: Type.String(),
    birthdate: Type.String(),
    fundraiser: Type.Object({
      name: Type.Optional(Type.String()),
      email: Type.String({
        format: "email",
      }),
      signatureImageUrl: Type.String(),
    }),
  }),
  program: Type.Object({
    id: Type.Number(),
    title: Type.String(),
    target: Type.Number(),
    category: Type.Object({
      id: Type.Number(),
    }),
  }),
  paymentMethod: PaymentMethod,
  amount: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  isVerified: Type.Boolean(),
  receiptUrl: Type.Optional(Type.String()),
  donaturId: Type.Number(),
  donationProgramId: Type.Number(),
  paymentMethodId: Type.Number(),
});

const TransactionInput = Type.Pick(Transaction, [
  "donationProgramId",
  "donaturId",
  "paymentMethodId",
  "amount",
  "receiptUrl",
]);

export type ITransaction = Static<typeof Transaction>;
export type ITransactionInput = Static<typeof TransactionInput>;

export const useTransactionListQuery = (
  query: { page: number; limit: number; search: string; programId?: string } = {
    page: 1,
    limit: 10,
    search: "",
    programId: undefined,
  }
) => {
  return useQuery(
    `transaction-list-${JSON.stringify(query)}`,
    async () => {
      const { data } = await httpClient.get<Pagination<ITransaction>>(
        `/api/transaction?page=${query.page}&limit=${query.limit}&search=${query.search}&programId=${query.programId}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useTransactionQuery = (id: number | string) => {
  return useQuery(
    `transaction-detail-${id}`,
    async () => {
      const { data } = await httpClient.get<ITransaction>(
        `/api/transaction/${id}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useCreateTransactionMutation = () => {
  return useMutation("transaction-create", async (data: ITransactionInput) => {
    const res = await httpClient.post(`/api/transaction`, data);
    return res.data;
  });
};

export const useVerifyTransactionMutation = () => {
  return useMutation("transaction-verify", async (data: { id: number }) => {
    const res = await httpClient.post(`/api/transaction/${data.id}/verify`);
    return res.data;
  });
};

export const useEditTransactionMutation = () => {
  return useMutation(
    "transaction-edit",
    async (data: ITransactionInput & { id: number }) => {
      const res = await httpClient.put(`/api/transaction/${data.id}`, data);
      return res.data;
    }
  );
};
