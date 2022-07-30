import { useQuery, useMutation } from "react-query";
import { httpClient } from "./httpClient";
import { Pagination } from "./pagination";

export interface IDonatur {
  id: number;
  name: string;
  gender: "MALE" | "FEMALE";
  address?: string;
  phoneNumber: string;
  birthdate: string;
  commitment: "RUTIN" | "ISIDENTIL";
  fundraiserId: number;
  programIds: any;
  DonaturOnProgram: any;
  fundraiser: {
    id: 0;
    name: number;
  };
}

export const useDonaturQuery = (id: number) => {
  return useQuery(
    `donatur-${id}`,
    async () => {
      const { data } = await httpClient.get<IDonatur>(`/donatur/${id}`);
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useDonaturListQuery = (
  query: { page: number; limit: number; search: string; programId?: string } = {
    page: 1,
    limit: 10,
    search: "",
  }
) => {
  return useQuery(
    `donatur-list-${JSON.stringify(query)}`,
    async () => {
      const { data } = await httpClient.get<Pagination<IDonatur>>(
        `/donatur?page=${query.page}&limit=${query.limit}&search=${query.search}&programId=${query.programId}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useCreateDonaturMutation = () => {
  return useMutation(
    "payment-method-create",
    async (data: Omit<IDonatur, "id" | "fundraiser">) => {
      const res = await httpClient.post("/donatur", data);
      return res.data;
    }
  );
};

export const useEditDonaturMutation = () => {
  return useMutation(
    "payment-method-edit",
    async (data: Omit<IDonatur, "fundraiser">) => {
      const { id, ...rest } = data;
      const res = await httpClient.put(`/donatur/${id}`, rest);
      return res.data;
    }
  );
};
