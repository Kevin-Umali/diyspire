"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectByAccountId } from "@/api/queries";
import { useAuth } from "@/context/authContext";
import { GlobalFilterState } from "@/interfaces";
import { Label } from "@radix-ui/react-label";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/account/components/data-table";

import { useDIYsColumns } from "./column";

function Diys() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [sortBy, setSortBy] = useState<SortingState | undefined>(undefined);
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterState>({ search: "", filteredColumn: ["title"] });

  const { data, isLoading } = useProjectByAccountId(accessToken!, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sortBy?.[0] && (sortBy[0].desc ? "desc" : "asc"),
    orderBy: sortBy?.[0]?.id,
    search: globalFilter.search,
    filter: globalFilter.filteredColumn,
  });

  const projectData =
    data?.data?.projects?.map(({ project }) => ({
      image: project.projectImage.urls.small,
      title: project.projectDetails.title,
      materials: project.projectDetails.materials,
      tools: project.projectDetails.tools,
      time: project.projectDetails.time,
      budget: project.projectDetails.budget,
      createdAt: project.createdAt,
    })) ?? [];

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-1 text-3xl font-semibold lg:text-4xl">Generated DIYs</h1>
        <Label className="text-md mb-5 mt-2 block text-sm">Your generated DIYs will appear here.</Label>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full flex-1 flex-col">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="private" disabled>
                  Private
                </TabsTrigger>
                <TabsTrigger value="public" disabled>
                  Public
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={() => router.push("/generate")}>
                  <PlusCircle className="size-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Generate DIYs Project Idea</span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>DIYS Project Ideas</CardTitle>
                  <CardDescription>Check out your DIYS projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={projectData ?? []}
                    state={{
                      pagination,
                      sortBy,
                      globalFilter,
                      totalCount: data?.data?.totalCount ?? 0,
                    }}
                    columns={useDIYsColumns()}
                    loading={isLoading}
                    onPaginationChange={setPagination}
                    onSortChange={setSortBy}
                    onGlobalFilterChange={setGlobalFilter}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Diys;
