import { useMutation, useQuery } from "react-query";
import { ILoginDTO, ILoginResponseDTO } from "@interface/auth";
import { IUser } from "@interface/user";
import { httpClient } from "./httpClient";

export const useLoginMutation = () =>
  useMutation<ILoginResponseDTO, any, any, any>(
    "login-mutation",
    async (loginData: ILoginDTO) => {
      try {
        const { data } = await httpClient.post<ILoginResponseDTO>(
          "/auth/login",
          loginData
        );
        return data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    }
  );

export const useLogoutMutation = () => {
  return useMutation("logout", async () => {
    await httpClient.post("/auth/logout");
    return true;
  });
};

export const useMe = () => {
  return useQuery("Me", async () => {
    const { data } = await httpClient.get<IUser>("/user/me");
    return data;
  }, {
    retry: 0
  });
};
