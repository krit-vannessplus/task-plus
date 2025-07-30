"use client";

//import TasksTable from "@/components/tasksTable";
import { useLiffProfile } from "@/components/liffContext";

export default function ListTasksPage() {
  const user = useLiffProfile();
  return <div className="p-4">{/*<TasksTable user={user} />*/}</div>;
}
