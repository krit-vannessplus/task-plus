"use client";

// --- IMPORTS (from both files) ---
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { DataTable } from "@/components/dataTable";
import { useLiffProfile } from "@/components/liffContext";
import { columns } from "@/components/columns";
import { Task } from "@/components/types";
import getData from "@/components/getData";
import { UserProvider } from "@/components/userContext";
import { TaskCard } from "@/components/taskCard";
import { EditTaskCard } from "@/components/editTaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

// --- COMPONENT 1: The Task List View (your original page) ---
function TaskList() {
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
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">
          View, filter, and manage all your tasks.
        </p>
      </div>
      <DataTable columns={columns} data={tasks} isLoading={isLoading} />
    </div>
  );
}

// --- COMPONENT 2: The Single Task Detail View ---
function TaskView({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const taskResp = await axios.get(GAS_URL, {
          params: {
            action: "getTask",
            payload: JSON.stringify({ TaskId: taskId }),
          },
        });
        if (taskResp.data) {
          setTask(taskResp.data);
        } else {
          setError("Task not found.");
        }
      } catch (err) {
        setError("Failed to load task details");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/50 backdrop-blur-sm">
          <CardHeader className="space-y-0 py-1.5 px-3 sm:px-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 -ml-2 text-muted-foreground w-fit"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-center text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <Card className="flex-1 bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-2xl w-full mx-auto pt-1.5">
        <CardHeader className="border-b space-y-0 pb-1 px-3 sm:px-4 [.border-b]:pb-2 pt-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {!loading && task && !isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 sm:h-7 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-1/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-2/3" />
              </div>
            </div>
          ) : task ? (
            !isEditing ? (
              <TaskCard task={task} />
            ) : (
              <EditTaskCard
                task={task}
                onCancelAction={() => setIsEditing(false)}
                onSaveAction={() => {
                  setIsEditing(false);
                  router.refresh();
                }}
              />
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

// --- COMPONENT 3: The Controller that decides which view to show ---
function TaskPageContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  // If a taskId exists in the URL, show the detail view.
  // Otherwise, show the list view.
  if (taskId) {
    return <TaskView taskId={taskId} />;
  }

  return <TaskList />;
}

// --- DEFAULT EXPORT: The Main Page ---
// This wraps everything in the necessary providers and Suspense boundary.
export default function TaskPage() {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        }
      >
        <TaskPageContent />
      </Suspense>
    </UserProvider>
  );
}
