"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import axios from "axios";
import { Task, User } from "./types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, User as UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

interface TaskCardProps {
  taskId: string;
}

export function TaskCard({ taskId }: TaskCardProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`taskId in TaskCard: ${taskId}`); // Debugging line

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task data
        const taskResp = await axios.get(GAS_URL, {
          params: {
            action: "getTask",
            payload: JSON.stringify({ TaskId: taskId }),
          },
        });
        console.log("Fetched task:", taskResp.data); // For debugging
        setTask(taskResp.data);

        // Fetch users for names mapping
        const usersResp = await axios.get(GAS_URL, {
          params: {
            action: "getUsers",
          },
        });

        setUsers(Array.isArray(usersResp.data) ? usersResp.data : []);
      } catch (err) {
        setError("Failed to load task details");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error || !task) {
    return (
      <Card className="w-full max-w-md mx-auto bg-destructive/10">
        <CardContent className="py-4">
          <p className="text-center text-destructive">
            {error || "Task not found"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{task.Task}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status: {task.Status}</span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>Due: {format(new Date(task.DueDate), "PPP")}</span>
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Assignees:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.Assignees.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Followers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Followers:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.Followers.map((name) => (
              <Badge key={name} variant="outline">
                {name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last updated: {format(new Date(task.UpdatedAt), "PPP 'at' pp")}
        </div>
      </CardContent>
    </Card>
  );
}
