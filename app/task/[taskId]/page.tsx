import { TaskWrapper } from "@/components/taskWrapper";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const taskId = (await params).taskId;
  console.log("Task ID:", taskId); // Debugging line to check taskId
  return <TaskWrapper taskId={taskId} />;
}
