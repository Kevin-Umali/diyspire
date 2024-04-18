"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/account/components/data-table-column-header";

export type DIYs = {
  image: string;
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  createdAt: string;
};

export const useDIYsColumns = (): ColumnDef<DIYs>[] => {
  return useMemo(
    () => [
      // Image column as before
      {
        accessorKey: "image",
        accessorFn: (row) => row.image,
        // header: "Image",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
        cell: ({ row }) => (
          <div>
            <Image alt={row.original.title} className="aspect-square rounded-md object-cover" height="64" src={row.original.image} width="64" />
          </div>
        ),
        enableHiding: false,
        enableSorting: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "title",
        accessorFn: (row) => row.title,
        // header: "Title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => row.original.title,
        enableHiding: true,
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        accessorKey: "materials",
        accessorFn: (row) => row.materials.join(", "),
        // header: "Materials",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Materials" />,
        cell: ({ row }) => row.original.materials.join(", "),
        enableHiding: false,
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        accessorKey: "tools",
        accessorFn: (row) => row.tools.join(", "),
        // header: "Tools",
        header: ({ column }) => <DataTableColumnHeader className="hidden md:table-cell" column={column} title="Tools" />,
        cell: ({ row }) => <div className="hidden md:table-cell">{row.original.tools.join(", ")}</div>,
        enableHiding: false,
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        accessorKey: "time",
        accessorFn: (row) => row.time,
        // header: "Time",
        header: ({ column }) => <DataTableColumnHeader className="hidden lg:table-cell" column={column} title="Time" />,
        cell: ({ row }) => <div className="hidden lg:table-cell">{row.original.time}</div>,
        enableHiding: false,
        enableSorting: true,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "budget",
        accessorFn: (row) => row.budget,
        // header: "Budget",
        header: ({ column }) => <DataTableColumnHeader className="hidden lg:table-cell" column={column} title="Budget" />,
        cell: ({ row }) => <div className="hidden lg:table-cell">{row.original.budget}</div>,
        enableHiding: false,
        enableSorting: true,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "createdAt",
        accessorFn: (row) => row.createdAt,
        // header: "Created At",
        header: ({ column }) => <DataTableColumnHeader className="hidden xl:table-cell" column={column} title="Created At" />,
        cell: ({ row }) => <div className="hidden xl:table-cell">{row.original.createdAt}</div>,
        enableHiding: false,
        enableSorting: true,
        enableGlobalFilter: false,
      },
    ],
    [],
  );
};
