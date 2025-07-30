"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Columns,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { UserFilter } from "@/components/userFilter";
import { Task } from "./types";

interface DataTableProps {
  columns: ColumnDef<Task, any>[];
  data: Task[];
  isLoading: boolean;
}

export function DataTable({ columns, data, isLoading }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    TaskId: false,
    Task: true,
    Status: true,
    DueDate: true,
    Assignees: true,
    Followers: false,
    UpdatedAt: false,
    isOverdue: false,
    actions: true,
  });
  const [taskFilter, setTaskFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState<Date>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (taskFilter) {
      filtered = filtered.filter((task) =>
        task.Task.toLowerCase().includes(taskFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((task) =>
        task.Status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    if (dueDateFilter) {
      const filterDate = new Date(dueDateFilter.setHours(0, 0, 0, 0));
      filtered = filtered.filter((task) => {
        const taskDate = new Date(new Date(task.DueDate).setHours(0, 0, 0, 0));
        return taskDate.getTime() === filterDate.getTime();
      });
    }
    if (selectedUsers.length > 0) {
      filtered = filtered.filter((task) =>
        task.Assignees.some((assignee) => selectedUsers.includes(assignee))
      );
    }

    return filtered;
  }, [data, taskFilter, statusFilter, dueDateFilter, selectedUsers]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const clearFilters = () => {
    setTaskFilter("");
    setStatusFilter("");
    setDueDateFilter(undefined);
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-4">
      {/* --- Toolbar for Filters and Column Visibility --- */}
      <div className="flex items-center justify-between gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Tasks</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-6 mx-4">
              <Input
                placeholder="Filter tasks by name..."
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              />
              <Input
                placeholder="Filter by status..."
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDateFilter
                      ? format(dueDateFilter, "PPP")
                      : "Pick a due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDateFilter}
                    onSelect={setDueDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <UserFilter
                selectedUsers={selectedUsers}
                onSelectAction={setSelectedUsers}
              />
              <Button variant="ghost" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto gap-2">
              <Columns className="h-4 w-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- Main Table View (Horizontally scrollable on small screens) --- */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.original.isOverdue ? "bg-destructive/10" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading tasks..." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} task(s).
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
