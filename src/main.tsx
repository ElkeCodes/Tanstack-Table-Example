import React from "react";
import ReactDOM from "react-dom/client";
import "twind/shim";

import "./index.css";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  createColumnHelper,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";

const formatNumber = (n: number): string => n.toLocaleString("nl-BE");

function App() {
  const columnHelper = createColumnHelper<Person>();
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      columnHelper.group({
        id: "names",
        header: () => <span>Names</span>,
        columns: [
          columnHelper.accessor("firstName", {
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor((row) => row.lastName, {
            id: "lastName",
            cell: (info) => <em>{info.getValue()}</em>,
            header: () => <em>Last Name</em>,
          }),
        ],
      }),
      columnHelper.accessor("age", {
        header: () => "Age",
        enableColumnFilter: false,
      }),
      columnHelper.accessor("favoriteGenre", {
        header: "Favorite Genre",
        enableSorting: false,
      }),
    ],
    []
  );

  const [data] = React.useState(() => makeData(100000));

  // const [sorting, setSorting] = React.useState<SortingState>([
  //   { id: "lastName", desc: false },
  // ]);
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
  //   { id: "favoriteGenre", value: "Metal" },
  // ]);
  // const [pagination, setPagination] = React.useState<PaginationState>({
  //   pageIndex: 20,
  //   pageSize: 40,
  // });

  const table = useReactTable({
    data,
    columns,
    // state: {
    //   sorting,
    //   columnFilters,
    //   pagination,
    // },
    // onColumnFiltersChange: setColumnFilters,
    // onSortingChange: setSorting,
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <input
                            type="text"
                            value={
                              (header.column.getFilterValue() ?? "") as string
                            }
                            onChange={(e) => {
                              header.column.setFilterValue(e.target.value);
                            }}
                            placeholder={`Search... (${
                              header.column.getFacetedUniqueValues().size
                            })`}
                            className="w-36 border shadow rounded"
                            list={header.column.id + "list"}
                          />
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 25)
            .map((row, index) => {
              return (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-blue-200" : "bg-blue-100"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="p-1 w-6 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          ⏮️
        </button>
        <button
          className="p-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ⏪️
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {formatNumber(table.getState().pagination.pageIndex + 1)} of{" "}
            {formatNumber(table.getPageCount())}
          </strong>
        </span>
        <button
          className="p-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ⏩️
        </button>
        <button
          className="p-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          ⏭️
        </button>
      </div>
      <div>
        {formatNumber(table.getFilteredRowModel().rows.length)} rows found
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
