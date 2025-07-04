import {
  BaseKey,
  CrudFilters,
  CrudSorting,
  LogicalFilter,
  Pagination,
} from "@refinedev/core";
import { AppRoute, AppRouter, initClient } from "@ts-rest/core";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { match, P } from "ts-pattern";

import { axiosInstance } from "./axios";
import {
  AxiosMethodTypes,
  BaseAxiosClientResponse,
  BaseResponseBody,
  BaseResponsesBody,
  CustomMetaQuery,
  ExtendedAxiosRequestConfig,
  InitClientProps,
  InitRestClientProps,
} from "./type";

export function initClientLegacy<
  T extends Record<string, AppRoute> = Record<string, AppRoute>
>({ contract, baseUrl, httpClient = axiosInstance }: InitClientProps<T>) {
  const schemaKeys = Object.keys(contract) as (keyof T)[];

  return schemaKeys.reduce(
    (
      result: {
        [K in keyof T]: <TData = any>(
          config?: ExtendedAxiosRequestConfig
        ) => Promise<AxiosResponse<TData>>;
      },
      current
    ) => {
      const { method, path } = contract[current as keyof T];
      const axiosMethod = method.toLowerCase() as AxiosMethodTypes;

      result[current as keyof T] = async (
        config?: ExtendedAxiosRequestConfig
      ) => {
        const routeParams = config?.routeParams;
        const route = match(routeParams)
          .with(P.not(P.nullish), (params) => {
            const basePath = `${baseUrl}/${path}`;
            return replaceRouteParams(basePath, params);
          })
          .otherwise(() => `${baseUrl}/${path}`);

        return await httpClient({
          method: axiosMethod,
          url: route,
          withCredentials: true,
          ...config,
        });
      };

      return result;
    },
    {} as never
  );
}

export function initRestClient<T extends AppRouter = AppRouter>({
  router,
  baseUrl,
  httpClient = axiosInstance,
}: InitRestClientProps<T>) {
  return initClient(router, {
    baseUrl,
    baseHeaders: {
      "Content-Type": "application/json",
    },
    api: async (props) => {
      const { method, headers, body, path } = props;
      try {
        const result = await httpClient.request({
          method,
          url: path,
          headers,
          data: body,
        });

        return Promise.resolve({
          status: result.status,
          body: result.data,
          headers: result.headers as unknown as Headers,
        });
      } catch (e) {
        if (isAxiosError(e) || (e as AxiosError).name === "AxiosError") {
          const { response } = e as AxiosError;
          return Promise.reject({
            status: response?.status,
            body: response?.data,
            headers: response?.headers as unknown as Headers,
          });
        }

        return Promise.reject({
          status: 500,
          body: null,
          headers: {} as Headers,
        });
      }
    },
  });
}

function replaceRouteParams(
  pattern: string,
  params: Record<string, BaseKey>
): string {
  return pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key]) {
      return String(params[key]);
    }
    throw new Error(`Missing value for parameter: ${key}`);
  });
}

export function responseOk(res: BaseAxiosClientResponse) {
  const responseBody = res.body as unknown as BaseResponseBody;
  if (![200, 201, 202, 203, 204, 205, 206, 207].includes(res.status)) {
    throw new Error(responseBody?.message);
  }

  return {
    data: responseBody?.data,
  };
}

export function responsesOk(res: BaseAxiosClientResponse) {
  const responsesBody = res.body as unknown as BaseResponsesBody;
  if (![200, 201, 202, 203, 204, 205, 206, 207].includes(res.status)) {
    throw new Error(responsesBody?.message);
  }

  return {
    data: responsesBody?.data || [],
    total: responsesBody?.metadata?.total_rows || 0,
    metadata: responsesBody?.metadata,
  };
}

export function responseError(err: unknown) {
  return Promise.reject(err);
}

export function generateParams(
  filters: CrudFilters = [],
  sorters: CrudSorting = [],
  pagination: Pagination = { current: 1, pageSize: 10, mode: "server" },
  opts?: {
    filterMode?: CustomMetaQuery["filterMode"];
    transformFilters?: CustomMetaQuery["transformFilters"];
    transformSorters?: CustomMetaQuery["transformSorters"];
    paginationMode?: CustomMetaQuery["paginationMode"];
  }
) {
  const paramsPagination = match(opts?.paginationMode)
    .with("none", () => undefined)
    .with("cursor", () => {
      const { _cursor, _page, _direction } = filters.reduce(
        (result, current) => {
          if (
            ["_cursor", "_page", "_direction"].includes(
              (current as LogicalFilter).field
            )
          ) {
            return {
              ...result,
              [(current as LogicalFilter).field]: current.value,
            };
          }

          return result;
        },
        {
          _page: 1,
          _cursor: undefined,
          _direction: undefined,
        }
      );
      return { _limit: pagination.pageSize, _page, _cursor, _direction };
    })
    .with("infinite", () => ({
      _page: pagination.current ?? 1,
      _limit: pagination.pageSize ?? 10,
    }))
    .otherwise(() => ({
      _page: pagination.current,
      _limit: pagination.pageSize,
    }));

  const transformedFilters = opts?.transformFilters?.(filters) || filters;
  const paramsFilter = transformedFilters.reduce(
    (
      params: Record<string, string | number | boolean | undefined>,
      currentValue
    ) => {
      const { field, value } = currentValue as Omit<LogicalFilter, "value"> & {
        value: string | number | boolean | undefined;
      };
      const isSkipUpsert =
        value === undefined ||
        ["_cursor", "_page", "_direction"].includes(field);

      if (isSkipUpsert) return params;

      return { ...params, [field]: value };
    },
    {}
  );

  const queries =
    Object.keys(paramsFilter).length > 0
      ? JSON.stringify(paramsFilter)
      : undefined;

  const transformedSorters = opts?.transformSorters?.(sorters) || sorters;
  const sorterString = transformedSorters
    .map((sorter) => {
      if (sorter.order === "asc") {
        return sorter.field;
      }
      return `-${sorter.field}`;
    })
    .join(",");
  const paramsSorter = sorterString ? { _sort: sorterString } : {};

  return { ...paramsPagination, ...paramsSorter, queries };
}
