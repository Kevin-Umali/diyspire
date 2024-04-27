"use client";

import { useState } from "react";
import { GlobalFilterState } from "@/interfaces";
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, PaginationState, SortingState, Updater, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  state: {
    pagination: PaginationState;
    sortBy: SortingState | undefined;
    globalFilter: GlobalFilterState;
    totalCount: number;
  };
  onGlobalFilterChange: (filters: GlobalFilterState) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  onSortChange: (sortingState: SortingState) => void;
}

const DataTable = <TData, TValue>({ columns, data, loading, state, onGlobalFilterChange, onPaginationChange, onSortChange }: DataTableProps<TData, TValue>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchInput, setSearchInput] = useState(state.globalFilter.search);

  const handleSortingChange: OnChangeFn<SortingState> = (updater: Updater<SortingState>) => {
    const newState = typeof updater === "function" ? updater(state.sortBy || []) : updater;
    onSortChange(newState);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater: Updater<PaginationState>) => {
    const newState = typeof updater === "function" ? updater(state.pagination) : updater;
    if (onPaginationChange) {
      onPaginationChange(newState);
    }
  };

  const handleGlobalFilterChange: OnChangeFn<GlobalFilterState> = (updater: Updater<GlobalFilterState>) => {
    const newState = typeof updater === "function" ? updater(state.globalFilter) : updater;
    if (onGlobalFilterChange) {
      onPaginationChange({ ...state.pagination, pageIndex: 0 });
      onGlobalFilterChange(newState);
    }
  };

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<unknown, any>[],
    pageCount: Math.ceil(state.totalCount / state.pagination.pageSize),
    state: {
      pagination: state.pagination,
      sorting: state.sortBy,
      globalFilter: state.globalFilter, // what type should I use here, please change it.
      columnVisibility,
    },
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {loading ? (
        <DataTableSkeleton columnCount={7} searchableColumnCount={1} shrinkZero />
      ) : (
        <>
          <div className="flex justify-between p-4">
            <div className="flex w-full">
              <Input placeholder="Search ..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <Button variant="outline" className="ml-auto" onClick={() => handleGlobalFilterChange({ ...state.globalFilter, search: searchInput })}>
                Search
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filtered:{" "}
                  <Badge variant={"outline"} className="ml-2">
                    {state.globalFilter.filteredColumn.length}
                  </Badge>{" "}
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanGlobalFilter() || column.columnDef.enableGlobalFilter)
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={state.globalFilter.filteredColumn.includes(column.id)}
                      onCheckedChange={(checked) => {
                        const isLastChecked = state.globalFilter.filteredColumn.length === 1 && state.globalFilter.filteredColumn.includes(column.id);
                        if (!isLastChecked || checked) {
                          handleGlobalFilterChange({
                            ...state.globalFilter,
                            filteredColumn: checked ? [...state.globalFilter.filteredColumn, column.id] : state.globalFilter.filteredColumn.filter((c) => c !== column.id),
                          });
                        }
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow className="" key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                      <Separator orientation="vertical" />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <TableCell key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            </Table>
          </div>
          <div className="flex flex-col gap-2.5">
            <DataTablePagination table={table}></DataTablePagination>
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
