import { IUser } from '.';

export interface IUsers {
	items: IUser[];
	limit: number;
	offset: number;
}
