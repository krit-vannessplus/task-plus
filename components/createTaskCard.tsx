"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { User } from "./types";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

interface CreateTaskCardProps {
  user: User;
}

export function CreateTaskCard({ user }: CreateTaskCardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState<Date>();
  const [assignees, setAssignees] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([user.UserId]); // Initialize with current user
  const [isLoading, setIsLoading] = useState(false);
  const [assigneeValue, setAssigneeValue] = useState<string>("");
  const [followerValue, setFollowerValue] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await axios.get(GAS_URL, {
          params: {
            action: "getUsers",
          },
        });
        // Ensure resp.data is an array
        const userData = Array.isArray(resp.data) ? resp.data : [];
        console.log("Fetched users:", userData); // For debugging
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Set empty array on error
      }
    };

    fetchUsers();
  }, []);

  const isFormValid = task && status && date && assignees.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const payloadObj = {
        Task: task,
        Status: status,
        DueDate: format(date!, "yyyy-MM-dd"),
        Assignees: assignees,
        Followers: followers,
      };

      const res = await axios.get(GAS_URL, {
        params: {
          action: "create",
          payload: JSON.stringify(payloadObj),
        },
      });

      // Reset form after successful submission
      setTask("");
      setStatus("");
      setDate(undefined);
      setAssignees([]);
      setFollowers([user.UserId]);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Task</label>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Textarea
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Enter status"
          />
        </div>

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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Assignees</label>
          <Select
            value={assigneeValue}
            onValueChange={(value) => {
              setAssignees([...assignees, value]);
              setAssigneeValue(""); // Reset the select
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignees" />
            </SelectTrigger>
            <SelectContent>
              {users
                .filter((u) => !assignees.includes(u.UserId))
                .map((user) => (
                  <SelectItem key={user.UserId} value={user.UserId}>
                    {user.Name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {/* Display selected assignees */}
          <div className="flex flex-wrap gap-2 mt-2">
            {assignees.map((userId) => (
              <div key={userId} className="bg-secondary p-1 rounded-md">
                {users.find((u) => u.UserId === userId)?.Name}
                <button
                  onClick={() =>
                    setAssignees(assignees.filter((id) => id !== userId))
                  }
                  className="ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Followers</label>
          <Select
            value={followerValue}
            onValueChange={(value) => {
              setFollowers([...followers, value]);
              setFollowerValue(""); // Reset the select
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select followers" />
            </SelectTrigger>
            <SelectContent>
              {users
                .filter((u) => !followers.includes(u.UserId))
                .map((user) => (
                  <SelectItem key={user.UserId} value={user.UserId}>
                    {user.Name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {/* Display selected followers */}
          <div className="flex flex-wrap gap-2 mt-2">
            {followers.map((userId) => (
              <div key={userId} className="bg-secondary p-1 rounded-md">
                {users.find((u) => u.UserId === userId)?.Name}
                {userId !== user.UserId && (
                  <button
                    onClick={() => {
                      if (userId !== user.UserId) {
                        // Prevent removing current user
                        setFollowers(followers.filter((id) => id !== userId));
                      }
                    }}
                    className="ml-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </CardContent>
    </Card>
  );
}
