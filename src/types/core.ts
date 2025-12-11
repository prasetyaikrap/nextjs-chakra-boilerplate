import type {
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  RowData,
} from "@tanstack/table-core";
import type { IconType } from "react-icons/lib";

export type BaseKey = string | number;
export type BaseRecord<T extends BaseKey = BaseKey> = {
  id: T;
};

export type Params = {
  slug?: string[] | string;
};

export type SearchParams = {
  preview?: string[] | string;
};

export type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

export type GenerateMetadataProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

export type BaseSelectOptions<T = object> = {
  label: string;
  value: string;
  description?: string;
  item?: T;
  Icon?: IconType;
  disabled?: boolean;
  meta?: BaseSelectOptionsMeta;
};

export type BaseSelectOptionsMeta = {
  group?: string;
  sub_type?: string[];
};

export type ExtendedColumnDef<T extends RowData = RowData> = {
  type?: "default" | "date" | "currency" | "number";
  textAlign?: string;
  format?: string;
} & ColumnDef<T>;

export type AppError<TError = unknown> = {
  type: string;
  message: string;
  error?: TError;
};

export type ExtendedColumnFilter = {
  is_permanent?: boolean;
} & ColumnFilter;

export type ExtendedSorting = {
  is_permanent?: boolean;
} & ColumnSort;
