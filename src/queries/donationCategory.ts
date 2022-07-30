import { useQuery } from "react-query";
import { httpClient } from "./httpClient";

export interface IDonationCategory {
  id: number;
  title: string;
  DonationProgram: {
    id: number;
    title: string;
    target: number;
  }[];
}

export const useDonationCategoryListQuery = () => {
  return useQuery(
    "donation-categories",
    async () => {
      const { data } = await httpClient.get<IDonationCategory[]>(
        "/donation-category"
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};
