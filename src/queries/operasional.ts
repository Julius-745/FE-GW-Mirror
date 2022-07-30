import { useQuery, useMutation } from "react-query";
import { httpClient } from "./httpClient";
import { Pagination } from "./pagination";

export interface IOperasional {
  id: number;
  title: string;
  category: "OPERASIONAL" | "PENDAYAGUNAAN";
  amount: number;
  createdAt: string;
}

export const useOperasionalQuery = (id: number) => {
  return useQuery(
    `operasional-${id}`,
    async () => {
      const { data } = await httpClient.get<IOperasional>(
        `api/operational/${id}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useOperasionalListQuery = (
  query: { page: number; limit: number; search: string } = {
    page: 1,
    limit: 10,
    search: "",
  }
) => {
  return useQuery(
    `operational-list-${JSON.stringify(query)}`,
    async () => {
      const { data } = await httpClient.get<Pagination<IOperasional>>(
        `api/operational?page=${query.page}&limit=${query.limit}&search=${query.search}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useCreateOperasionalMutation = () => {
  return useMutation(
    "operatioanal-create",
    async (data: Omit<IOperasional, "id">) => {
      const res = await httpClient.post("api/operational", data);
      return res.data;
    }
  );
};

export const useEditOperasionalMutation = () => {
  return useMutation(
    "operational-edit",
    async (data: Omit<IOperasional, "operasional">) => {
      const { id, ...rest } = data;
      const res = await httpClient.put(`api/operational/${id}`, rest);
      return res.data;
    }
  );
};
