"use client";

import { DataTable } from "@/components/dataTable";
import { useLiffProfile } from "@/components/liffContext";
import { columns } from "@/components/columns";
import { Task } from "@/components/types";

async function getData(): Promise<Task[]> {
  // Fetch data from your API here.
  return [];
}

export default async function ListTasksPage() {
  const user = useLiffProfile();
  const data = await getData();

  return <div className="p-4">{/*<TasksTable user={user} />*/}</div>;
}
