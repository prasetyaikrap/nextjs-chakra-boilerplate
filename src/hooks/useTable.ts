"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type Table,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import { dataProviders } from "@/src/providers/data";
import type { BaseRecord, CrudFilter, CrudSort, Pagination } from "@/src/types";
import type {
  DataProvider,
  MetaQuery,
  ResponseBody,
  ResponsesBody,
} from "../providers/data/type";

export type UseTableProps<TData extends BaseRecord = BaseRecord> = {
  providers?: ProviderProps;
} & Pick<TableOptions<TData>, "columns"> &
  Partial<Omit<TableOptions<TData>, "columns">>;

type DataProviders = typeof dataProviders;
type ExtractResourceKeys<T> = T extends DataProvider<infer R> ? R : never;

type ProviderProps = {
  dataProviderName?: keyof DataProviders;
  resource?: ExtractResourceKeys<DataProviders[keyof DataProviders]>;
  pagination?: Pagination;
  filters?: {
    initial?: CrudFilter[];
    permanent?: CrudFilter[];
  };
  sorters?: {
    initial?: CrudSort[];
    permanent?: CrudSort[];
  };
  syncWithLocation?: boolean;
  meta?: MetaQuery;
  queryOptions?: {
    enabled?: boolean;
  };
};

export type UseTableReturnType<TData extends BaseRecord = BaseRecord> = {
  reactTable: Table<TData>;
  core: {
    tableQuery: {
      data: Omit<ResponsesBody<TData>, "error"> | null;
      error: Omit<ResponseBody<TData>, "data"> | null;
      isLoading: boolean;
      isFetching: boolean;
      isError: boolean;
      refetch: () => void;
    };
    result: {
      data: TData[];
      total: number;
    };
    pageCount: number;
    currentPage: number;
    pageSize: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    sorters: CrudSort[];
    setSorters: (sorters: CrudSort[]) => void;
    filters: CrudFilter[];
    setFilters: (filters: CrudFilter[]) => void;
  };
};

const fallbackEmptyArray: unknown[] = [];

export function useTable<TData extends BaseRecord = BaseRecord>({
  providers,
  ...reactTableOptions
}: UseTableProps<TData>): UseTableReturnType<TData> {
  const isFirstRender = useIsFirstRender();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: providers?.pagination?.pageSize ?? 10,
    currentPage: providers?.pagination?.currentPage ?? 1,
  });
  const [filters, setFilters] = useState<CrudFilter[]>([
    ...(providers?.filters?.initial ?? []),
    ...(providers?.filters?.permanent ?? []),
  ]);
  const [sorters, setSorters] = useState<CrudSort[]>([
    ...(providers?.sorters?.initial ?? []),
    ...(providers?.sorters?.permanent ?? []),
  ]);
  const [error, setError] = useState<Omit<ResponseBody<TData>, "data"> | null>(
    null,
  );
  const [data, setData] = useState<Omit<ResponsesBody<TData>, "error"> | null>(
    null,
  );

  const isServerSide = Boolean(providers);

  useEffect(() => {
    const isQueryEnabled = providers?.queryOptions?.enabled ?? true;
    const dataProviderName = providers?.dataProviderName || "default";
    const resource = providers?.resource;
    if (!isServerSide || !isQueryEnabled || !resource) {
      setIsLoading(false);
      return;
    }

    // // Fetch data from data provider here based on providers props
    setIsFetching(true);
    setIsError(false);
    dataProviders[dataProviderName]
      .getList({
        resource,
        pagination,
        filters,
        sorters,
        meta: providers.meta,
      })
      .then((res) => {
        setIsError(false);
        setError(null);
        setData({
          success: res.success,
          data: res.data as TData[],
          message: res.message,
          metadata: res.metadata,
        });
      })
      .catch((e: ResponseBody<TData>) => {
        setIsError(true);
        setError({ success: e.success, message: e.message, error: e.error });
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
        setIsFetching(false);
      });
  }, [
    providers?.queryOptions?.enabled,
    providers?.dataProviderName,
    providers?.resource,
    pagination,
    filters,
    sorters,
    refetch,
  ]);

  const reactTableProps = useReactTable<TData>({
    data: data?.data ?? (fallbackEmptyArray as TData[]),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: (pagination.currentPage || 1) - 1,
        pageSize: pagination.pageSize || 10,
      },
      columnFilters: filters.map((filter) => ({
        id: filter.field,
        value: filter.value,
      })),
      sorting: sorters.map((sorter) => ({
        id: sorter.field,
        desc: sorter.order === "desc",
      })),
      ...reactTableOptions.initialState,
    },
    pageCount: data?.metadata.total_page,
    manualPagination: true,
    manualFiltering: isServerSide,
    manualSorting: isServerSide,
    ...reactTableOptions,
  });

  const { state, columns } = reactTableProps.options;
  const {
    pagination: reactTablePagination,
    sorting: reactTableSorting,
    columnFilters,
  } = state;

  const { pageIndex, pageSize } = reactTablePagination ?? {};

  useEffect(() => {
    if (pageIndex !== undefined) {
      setPagination((prev) => ({
        ...prev,
        currentPage: pageIndex + 1,
      }));
    }
  }, [pageIndex]);

  useEffect(() => {
    if (pageSize !== undefined) {
      setPagination((prev) => ({
        ...prev,
        pageSize: pageSize,
      }));
    }
  }, [pageSize]);

  useEffect(() => {
    if (!reactTableSorting) return;
    const newSorters: CrudSort[] = reactTableSorting.map((sorting) => ({
      field: sorting.id,
      order: sorting.desc ? "desc" : "asc",
    }));

    providers?.sorters?.permanent?.forEach((permanentSorter) => {
      if (!newSorters.find((s) => s.field === permanentSorter.field)) {
        newSorters.push(permanentSorter);
      }
    });

    if (!isEqual(sorters, newSorters)) {
      setSorters(newSorters);
    }

    if (newSorters.length > 0 && !isFirstRender) {
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }
  }, [reactTableSorting]);

  useEffect(() => {
    if (!columnFilters) return;

    const newFilters: CrudFilter[] = columnFilters.map((columnFilter) => ({
      field: columnFilter.id,
      value: columnFilter.value,
    }));

    providers?.filters?.permanent?.forEach((permanentFilter) => {
      if (!newFilters.find((f) => f.field === permanentFilter.field)) {
        newFilters.push(permanentFilter);
      }
    });

    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
    }

    if (newFilters.length > 0 && !isFirstRender) {
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }
  }, [columnFilters, columns]);

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  const setPageSize = (size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
    }));
  };

  return {
    reactTable: reactTableProps,
    core: {
      tableQuery: {
        data,
        error,
        isLoading,
        isFetching,
        isError,
        refetch: () => setRefetch((prev) => !prev),
      },
      result: {
        data: data?.data ?? (fallbackEmptyArray as TData[]),
        total: data?.metadata?.total_rows ?? 0,
      },
      pageCount: data?.metadata?.total_page ?? 0,
      currentPage: pagination.currentPage ?? 1,
      pageSize: pagination.pageSize ?? 10,
      setCurrentPage,
      setPageSize,
      sorters: sorters,
      setSorters,
      filters: filters,
      setFilters,
    },
  };
}

export const useIsFirstRender = () => {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
};
