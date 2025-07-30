"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Task } from "./types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, User as UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{task.Task}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Status: {task.Status}
          </span>
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
