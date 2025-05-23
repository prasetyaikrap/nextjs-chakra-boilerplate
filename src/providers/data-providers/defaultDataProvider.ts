import {
  CreateResponse,
  DataProvider,
  DeleteOneResponse,
  GetListResponse,
  GetOneResponse,
  UpdateResponse,
} from "@refinedev/core";
import type { AxiosInstance } from "axios";
import { match } from "ts-pattern";

import { axiosInstance } from "./axios";
import {
  generateParams,
  initRestClient,
  responseError,
  responseOk,
  responsesOk,
} from "./handler";
import { defaultAppApi } from "./schema";
import { CustomMetaQuery } from "./type";

type BaseParamsMatcher = {
  resource: string;
  metadata?: Record<string, string | number>;
};

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "getMany" | "createMany" | "updateMany" | "deleteMany"
> => {
  const service = initRestClient({
    router: defaultAppApi,
    baseUrl: apiUrl,
    httpClient,
  });

  return {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const { transformFilters, transformSorters, paginationMode, filterMode } =
        meta as CustomMetaQuery;
      const params = generateParams(filters, sorters, pagination, {
        transformFilters,
        transformSorters,
        paginationMode,
        filterMode,
      });

      return match<BaseParamsMatcher>({ resource }).otherwise(() =>
        Promise.reject("Method not implemented")
      ) as Promise<GetListResponse<never>>;
    },

    create: async ({ resource }) => {
      return match<BaseParamsMatcher>({ resource }).otherwise(() =>
        Promise.reject("Method not implemented")
      ) as Promise<CreateResponse<never>>;
    },

    update: async ({ resource }) => {
      return match<BaseParamsMatcher>({ resource }).otherwise(() =>
        Promise.reject("Method not implemented")
      ) as Promise<UpdateResponse<never>>;
    },

    getOne: async ({ resource }) => {
      return match<BaseParamsMatcher>({ resource }).otherwise(() =>
        Promise.reject("Method not implemented")
      ) as Promise<GetOneResponse<never>>;
    },

    deleteOne: async ({ resource }) => {
      return match<BaseParamsMatcher>({ resource }).otherwise(() =>
        Promise.reject("Method not implemented")
      ) as Promise<DeleteOneResponse<never>>;
    },

    custom: async ({
      url,
      method,
      sorters,
      filters,
      payload,
      headers,
      meta,
    }) => {
      const { transformFilters, transformSorters, paginationMode, filterMode } =
        meta as CustomMetaQuery;
      const params = generateParams(
        filters,
        sorters,
        { current: 1, pageSize: 10 },
        {
          transformFilters,
          transformSorters,
          paginationMode,
          filterMode,
        }
      );

      try {
        const result = await httpClient.request({
          url,
          method,
          params,
          data: payload,
          headers,
        });
        return {
          data: result.data,
        };
      } catch (error) {
        return responseError(error);
      }
    },

    getApiUrl: () => {
      return apiUrl;
    },
  };
};
