"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Task, User } from "./types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

interface EditTaskCardProps {
  taskId: string;
  onCancelAction: () => void;
  onSaveAction: () => void;
}

export function EditTaskCard({
  taskId,
  onCancelAction,
  onSaveAction,
}: EditTaskCardProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [date, setDate] = useState<Date>();
  const [assigneeValue, setAssigneeValue] = useState<string>("");
  const [followerValue, setFollowerValue] = useState<string>("");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task and users in parallel
        const [taskResp, usersResp] = await Promise.all([
          axios.get(GAS_URL, {
            params: {
              action: "getTask",
              payload: JSON.stringify({ TaskId: taskId }),
            },
          }),
          axios.get(GAS_URL, {
            params: {
              action: "getUsers",
            },
          }),
        ]);

        setTask(taskResp.data);
        setDate(new Date(taskResp.data.DueDate));
        setUsers(Array.isArray(usersResp.data) ? usersResp.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!task || !date) return;

    setUpdating(true);
    try {
      await axios.get(GAS_URL, {
        params: {
          action: "updateTask",
          payload: JSON.stringify({
            ...task,
            DueDate: format(date, "yyyy-MM-dd"),
          }),
        },
      });
      onSaveAction();
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setUpdating(false);
    }
  };

  const removeAssignee = (userId: string) => {
    if (!task) return;
    setTask({
      ...task,
      Assignees: task.Assignees.filter((id) => id !== userId),
    });
  };

  const removeFollower = (userId: string) => {
    if (!task) return;
    setTask({
      ...task,
      Followers: task.Followers.filter((id) => id !== userId),
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="space-y-4 p-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!task) {
    return <div className="text-red-500">Failed to load task</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Edit Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        {/* Task Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Task Description</label>
          <Textarea
            value={task.Task}
            onChange={(e) => setTask({ ...task, Task: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Textarea
            value={task.Status}
            onChange={(e) => setTask({ ...task, Status: e.target.value })}
            placeholder="Enter status"
            className="min-h-[60px]"
          />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assignees</label>
          <Select
            value={assigneeValue}
            onValueChange={(value) => {
              if (!task.Assignees.includes(value)) {
                setTask({
                  ...task,
                  Assignees: [...task.Assignees, value],
                });
              }
              setAssigneeValue("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.Name} value={user.Name}>
                  {user.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.Assignees.map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {name}
                {task.Assignees.length > 1 && (
                  <button
                    onClick={() => removeAssignee(name)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Followers */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Followers</label>
          <Select
            value={followerValue}
            onValueChange={(value) => {
              if (!task.Followers.includes(value)) {
                setTask({
                  ...task,
                  Followers: [...task.Followers, value],
                });
              }
              setFollowerValue("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add follower" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.Name} value={user.Name}>
                  {user.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.Followers.map((name) => (
              <Badge
                key={name}
                variant="outline"
                className="flex items-center gap-1"
              >
                {name}
                {task.Followers.length > 1 && (
                  <button
                    onClick={() => removeFollower(name)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4">
          <Button variant="outline" onClick={onCancelAction}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
