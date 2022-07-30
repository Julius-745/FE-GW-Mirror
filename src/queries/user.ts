import { Type, Static } from "@sinclair/typebox";
import { useQuery, useMutation } from "react-query";
import { Role } from "./role";
import { Pagination } from "./pagination";
import { httpClient } from "./httpClient";

export const User = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  role: Role,
  signatureImageUrl: Type.String(),
});

export const UserInput = Type.Object({
  name: Type.String(),
  email: Type.String(),
  roleId: Type.Number(),
  signatureImageUrl: Type.String(),
});

export type IUserInput = Static<typeof UserInput>;

export type IUser = Static<typeof User>;

export const useUserListQuery = (
  query: { page: number; limit: number; search: string } = {
    page: 1,
    limit: 10,
    search: "",
  }
) => {
  return useQuery(
    `user-list-${JSON.stringify(query)}`,
    async () => {
      const { data } = await httpClient.get<Pagination<IUser>>(
        `/user?page=${query.page}&limit=${query.limit}&search=${query.search}`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useActivationInfo = (id: number, code: string) => {
  return useQuery(
    `activation-info-${id}-${code}`,
    async () => {
      const { data } = await httpClient.get<Pick<IUser, "id" | "name">>(
        `/user/${id}/${code}/activate`
      );
      return data;
    },
    {
      retry: 0,
    }
  );
};

export const useActivationMutation = () => {
  return useMutation(
    "activation-mutation",
    async (data: { id: string | number; code: string; password: string }) => {
      const res = await httpClient.post("/user/activate", data);
      return res.data;
    }
  );
};

export const useCreateUserMutation = () => {
  return useMutation("user-create", async (data: IUserInput) => {
    const res = await httpClient.post("/user", data);
    return res.data;
  });
};
