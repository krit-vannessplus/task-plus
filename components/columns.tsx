"use client";

import { Task } from "./types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

// ✅ Create a new component for the actions cell
const ActionsCell = ({ row }: { row: Row<Task> }) => {
  const router = useRouter(); // Hook is now called inside a React component
  const task = row.original;

  return (
    <div className="text-center">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => router.push(`/task?taskId=${task.TaskId}`)}
      >
        <span className="sr-only">Open Task</span>
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "TaskId",
    header: "Task Id",
    // This column is hidden by default but available
  },
  {
    accessorKey: "Task",
    header: "Task",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("Task")}</div>
    ),
  },
  {
    accessorKey: "Status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={row.original.isOverdue ? "destructive" : "secondary"}
          className="capitalize"
        >
          {row.getValue("Status")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "DueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-start p-0 hover:bg-transparent"
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isOverdue: boolean | undefined = row.original.isOverdue;
      return (
        <div className={isOverdue ? "text-destructive font-semibold" : ""}>
          {new Date(row.getValue("DueDate")).toLocaleDateString()}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "Assignees",
    header: "Assignees",
    cell: ({ row }) => {
      const assignees = row.getValue("Assignees") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {assignees.map((assignee: string) => (
            <Badge key={assignee} variant="outline">
              {assignee}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "Followers",
    header: "Followers",
    // Hidden by default
  },
  {
    accessorKey: "UpdatedAt",
    header: "Last Updated",
    // Hidden by default
  },
  {
    accessorKey: "isOverdue",
    header: "Overdue",
    // Hidden by default, info is shown in Status/DueDate
  },
  {
    id: "actions",
    // ✅ Use the new component in the cell renderer
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
