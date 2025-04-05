import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, RowModel, Table, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { logger } from "../../../Utils/Logger/Logger";

export function DataGuide() {
  const data: User[] = useMemo(
    () => [
      {
        firstName: "Tanner",
        lastName: "Linsley",
        age: 33,
        visits: 100,
        progress: 50,
        status: "Married",
      },
      {
        firstName: "Kevin",
        lastName: "Vandy",
        age: 27,
        visits: 200,
        progress: 100,
        status: "Single",
      },
    ],
    []
  );
  const columnHelper = createColumnHelper<User>();
  const columns = [columnHelper.accessor((x) => x.firstName, { id: "firstName" })];
  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });
  return <table />;
}

//TData
type User = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};

// Sample data
const data = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

// Define columns
const columns: ColumnDef<(typeof data)[0]>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

export default function MyTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  logger.debug("MyTable", table);
  return (
    <table border={1}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
