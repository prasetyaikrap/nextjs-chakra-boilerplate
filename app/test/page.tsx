"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Table from "@/src/components/table";
import { LanguageSelector } from "@/src/components/ui/language-selector";
import { useTable } from "@/src/hooks/useTable";

export default function Page() {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
      },
    ],
    [],
  );
  const tableProps = useTable({
    providers: {
      dataProviderName: "auth",
      resource: "test-posts",
    },
    columns,
  });

  return (
    <div>
      <Table
        {...tableProps}
        filters={{ filtersDef: [{ id: "title", label: "Title" }] }}
      />
      <LanguageSelector />
    </div>
  );
}
