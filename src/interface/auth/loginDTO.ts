import { IUserDTO, IUser } from "@interface";

export interface ILoginDTO extends Pick<IUserDTO, "email" | "password"> {}

export interface ILoginResponseDTO extends IUser {
  token: string;
}
