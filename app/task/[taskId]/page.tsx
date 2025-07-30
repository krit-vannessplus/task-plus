import { TaskWrapper } from "@/components/taskWrapper";

// Define the component props type for clarity
type TaskPageProps = {
  params: {
    taskId: string;
  };
};

// Removed "async" as no await calls are made in this component
export default function TaskPage({ params }: TaskPageProps) {
  const { taskId } = params;

  // You can still keep this for debugging on the server
  console.log("Task ID:", taskId);

  return <TaskWrapper taskId={taskId} />;
}
