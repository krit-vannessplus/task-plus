"use client";

import { useState } from "react";
import { TaskCard } from "@/components/taskCard";
import { EditTaskCard } from "@/components/editTaskCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskWrapperProps {
  taskId: string;
}

export function TaskWrapper({ taskId }: TaskWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card className="p-6">
        {!isEditing ? (
          // Display Mode
          <div className="space-y-6">
            <TaskCard taskId={taskId} />
            <div className="flex justify-end">
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" /> Edit Task
              </Button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
            <EditTaskCard
              taskId={taskId}
              onCancel={() => setIsEditing(false)}
              onSave={() => {
                setIsEditing(false);
                // Optionally refresh the page or task data
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
