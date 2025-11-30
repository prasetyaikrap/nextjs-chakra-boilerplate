import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { BaseKey, BaseRecord } from "@/src/types/core";
import type {
  CrudFilter,
  CrudFilters,
  CrudSort,
  CrudSorting,
  Pagination,
} from "@/src/types/pagination";

export type MethodTypes = "GET" | "DELETE" | "HEAD" | "OPTIONS";
export type MethodTypesWithBody = "POST" | "PUT" | "PATCH";

export type AxiosMethodTypes =
  | "get"
  | "delete"
  | "head"
  | "options"
  | "post"
  | "put"
  | "patch";

export type ExtendedAxiosRequestConfig = {
  routeParams?: Record<string, BaseKey>;
} & AxiosRequestConfig;

export type InitRestClientProps = {
  baseUrl: string;
  httpClient?: AxiosInstance;
};

export type ResponseBody<TData extends BaseRecord = BaseRecord> = {
  success: boolean;
  message: string;
  data: TData;
  error?: Error;
};

export type ResponsesBody<TData extends BaseRecord = BaseRecord> = {
  success: boolean;
  message: string;
  data: TData[];
  metadata: {
    total_rows: number;
    total_page: number;
    current_page: number;
    per_page: number;
    previousCursor: string;
    nextCursor: string;
  };
  error?: Error;
};

export type BaseAxiosClientResponse<T = unknown> = {
  status: number;
  body: T;
  headers: Headers;
};

export type MetaQuery = {
  transformFilters?: (filters?: CrudFilters) => CrudFilters;
  transformSorters?: (sorters?: CrudSorting) => CrudSorting;
  paginationMode?: "default" | "per_page" | "cursor" | "infinite" | "none";
  filterMode?: "default";
} & Record<string, any>;

export type DataProvider<TResource extends string = string> = {
  getList: (params: GetListParams<TResource>) => Promise<GetListResponse>;
  getOne: (params: GetOneParams<TResource>) => Promise<GetOneResponse>;
  create: (params: CreateParams<TResource>) => Promise<CreateResponse>;
  update: (params: UpdateParams<TResource>) => Promise<UpdateResponse>;
  delete: (params: DeleteParams<TResource>) => Promise<DeleteResponse>;
};

export type GetListParams<TResource extends string = string> = {
  resource: TResource;
  pagination?: Pagination;
  sorters?: CrudSort[];
  filters?: CrudFilter[];
  meta?: MetaQuery;
};

export type GetOneParams<TResource extends string = string> = {
  resource: TResource;
  id: BaseKey;
  meta?: MetaQuery;
};

type CreateParams<
  TResource extends string = string,
  TVariables = Record<string, unknown>,
> = {
  resource: TResource;
  variables: TVariables;
  meta?: MetaQuery;
};
type UpdateParams<
  TResource extends string = string,
  TVariables = Record<string, unknown>,
> = {
  resource: TResource;
  id: BaseKey;
  variables: TVariables;
  meta?: MetaQuery;
};
type DeleteParams<TResource extends string = string> = {
  resource: TResource;
  id: BaseKey;
  meta?: MetaQuery;
};

export type GetListResponse<TData extends BaseRecord = BaseRecord> =
  ResponsesBody<TData>;
export type GetOneResponse<TData extends BaseRecord = BaseRecord> =
  ResponseBody<TData>;
export type CreateResponse<TData extends BaseRecord = BaseRecord> =
  ResponseBody<TData>;
export type UpdateResponse<TData extends BaseRecord = BaseRecord> =
  ResponseBody<TData>;
export type DeleteResponse<TData extends BaseRecord = BaseRecord> =
  ResponseBody<TData>;
