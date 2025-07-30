import { TaskWrapper } from "@/components/taskWrapper";

// Re-added async and defined props inline. This is a more common pattern
// in the Next.js App Router and can resolve these specific build-time type errors.
// The build process seems to expect an async component signature.
export default async function TaskPage({
  params,
}: {
  params: {
    taskId: string;
  };
}) {
  const { taskId } = params;

  // You can still keep this for debugging on the server
  console.log("Task ID:", taskId);

  return <TaskWrapper taskId={taskId} />;
}
