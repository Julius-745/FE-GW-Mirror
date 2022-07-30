import { IRole } from '.';

export interface IUser {
	id: number;
	name: string;
	email: string;
	role: IRole;
}
