"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dataTable";
import { useLiffProfile } from "@/components/liffContext";
import { columns } from "@/components/columns";
import { Task } from "@/components/types";
import getData from "@/components/getData";
import { UserProvider } from "@/components/userContext"; // <-- Import the provider

export default function ListTasksPage() {
  const user = useLiffProfile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (user && user.UserId) {
        const data = await getData(user.UserId);
        setTasks(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [user]);

  return (
    // Wrap the entire page content with UserProvider
    <UserProvider>
      <div className="container mx-auto p-2 sm:p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            View, filter, and manage all your tasks.
          </p>
        </div>
        <DataTable columns={columns} data={tasks} isLoading={isLoading} />
      </div>
    </UserProvider>
  );
}
