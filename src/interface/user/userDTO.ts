import { IUser } from ".";

export interface IUserDTO extends Pick<IUser, "name" | "email"> {
  password: string;
  roleId: number;
}
