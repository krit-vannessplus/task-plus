// "use client";

// import { useState, useEffect } from "react";
// import {
//   ColumnDef,
//   Row,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   ColumnFiltersState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Task, User } from "./types";
// import { Skeleton } from "@/components/ui/skeleton";

// const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

// interface TasksTableProps {
//   user: User;
// }

// export default function TasksTable({ user }: TasksTableProps) {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const router = useRouter();

//   // Fetch tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(GAS_URL, {
//           params: {
//             action: "getTasksFor",
//             payload: JSON.stringify({ UserId: user.UserId }),
//           },
//         });
//         setTasks(Array.isArray(response.data) ? response.data : []);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setTasks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [user.UserId]);

//   const columns: ColumnDef<Task>[] = [
//     {
//       accessorKey: "Task",
//       header: "Task",
//       cell: ({ row }: { row: Row<Task> }) => (
//         <Button
//           variant="link"
//           className="p-0 h-auto text-left font-normal"
//           onClick={() => router.push(`/task?taskId=${row.original.TaskId}`)}
//         >
//           {row.getValue("Task")}
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "Status",
//       header: "Status",
//       cell: ({ row }: { row: Row<Task> }) => {
//         const status = row.getValue("Status") as string;
//         return (
//           <Badge
//             variant={
//               status.toLowerCase() === "completed"
//                 ? "destructive"
//                 : status.toLowerCase() === "in progress"
//                 ? "secondary"
//                 : "default"
//             }
//           >
//             {status}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "Assignees",
//       header: "Assignees",
//       cell: ({ row }: { row: Row<Task> }) => {
//         const assignees = row.getValue("Assignees") as string[];
//         return (
//           <div className="flex flex-wrap gap-1">
//             {assignees.map((assignee) => (
//               <Badge key={assignee} variant="secondary">
//                 {assignee}
//               </Badge>
//             ))}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "Followers",
//       header: "Followers",
//       cell: ({ row }: { row: Row<Task> }) => {
//         const followers = row.getValue("Followers") as string[];
//         return (
//           <div className="flex flex-wrap gap-1">
//             {followers.map((follower) => (
//               <Badge key={follower} variant="outline">
//                 {follower}
//               </Badge>
//             ))}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "DueDate",
//       header: "Is Overdue",
//       cell: ({ row }: { row: Row<Task> }) => {
//         const dueDate = new Date(row.getValue("DueDate") as string);
//         const isOverdue =
//           dueDate < new Date() && row.getValue("Status") !== "Completed";

//         return (
//           <Badge variant={isOverdue ? "destructive" : "default"}>
//             {isOverdue ? "Yes" : "No"}
//           </Badge>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: tasks,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     state: {
//       columnFilters,
//       globalFilter,
//     },
//   });

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-10 w-full" />
//         <div className="space-y-2">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Skeleton key={i} className="h-16 w-full" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <Input
//         placeholder="Filter tasks..."
//         value={globalFilter ?? ""}
//         onChange={(event) => setGlobalFilter(event.target.value)}
//         className="max-w-sm"
//       />
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup: any) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header: any) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row: any) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell: any) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
