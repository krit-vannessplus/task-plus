import { TaskWrapper } from "@/components/taskWrapper";

type Props = {
  params: { taskId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function TaskPage({ params }: Props) {
  const { taskId } = params;
  console.log("Task ID:", taskId); // Debugging line to check taskId
  return <TaskWrapper taskId={taskId} />;
}
