import { useQuery } from "react-query";
import { Type, Static } from "@sinclair/typebox";
import { httpClient } from "./httpClient";

export const Role = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

type IRole = Static<typeof Role>;

export const useRoleListQuery = () => {
  return useQuery(
    `role-list`,
    async () => {
      const { data } = await httpClient.get<IRole[]>(`/role`);
      return data;
    },
    {
      retry: 0,
    }
  );
};
