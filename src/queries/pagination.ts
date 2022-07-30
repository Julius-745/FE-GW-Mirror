export interface Pagination<T> {
  page: number;
  limit: number;
  totalPage: number;
  data: T[];
}
