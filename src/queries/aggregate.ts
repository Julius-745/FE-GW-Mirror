import { useQuery } from "react-query";
import { httpClient } from "./httpClient";

export const useAggregateCategoryQuery = () => {
  return useQuery(
    `aggregate-category`,
    async () => {
      const { data } = await httpClient.get<any[]>(`/api/aggregate/category`);
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useAggregateTransactionQuery = () => {
  return useQuery(
    "aggregate-transaction",
    async () => {
      const { data } = await httpClient.get<any[]>(
        `/api/aggregate/transaction`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};
