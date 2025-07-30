import { TaskWrapper } from "@/components/taskWrapper";

export default function TaskPage({ params }: { params: { taskId: string } }) {
  const { taskId } = params;
  console.log("Task ID:", taskId); // Debugging line to check taskId
  return <TaskWrapper taskId={taskId} />;
}
