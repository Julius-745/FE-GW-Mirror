import { useQuery, useMutation } from "react-query";
import { httpClient } from "./httpClient";
import { Pagination } from "./pagination";

export interface IDonationProgram {
  id: number;
  title: string;
  categoryId: number;
  target: number;
  _count: {
    DonaturOnProgram: number;
  };
  category: {
    id: number;
    title: number;
  };
}

export const useDonationProgramListQuery = (
  query: { page: number; limit: number; search: string } = {
    page: 1,
    limit: 10,
    search: "",
  }
) => {
  return useQuery(
    `donation-programs-${JSON.stringify(query)}`,
    async () => {
      const { data } = await httpClient.get<Pagination<IDonationProgram>>(
        `/donation-program?page=${query.page}&limit=${query.limit}&search=${query.search}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useCreateDonationProgramMutation = () => {
  return useMutation(
    "donation-program-create",
    async (data: Pick<IDonationProgram, "title" | "categoryId" | "target">) => {
      const res = await httpClient.post("/donation-program", data);
      return res.data;
    }
  );
};

export const useEditDonationProgramMutation = () => {
  return useMutation(
    "donation-program-create",
    async (
      data: Pick<IDonationProgram, "id" | "title" | "categoryId" | "target">
    ) => {
      const { id, ...rest } = data;
      const res = await httpClient.put(`/donation-program/${id}`, rest);
      return res.data;
    }
  );
};
