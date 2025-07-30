export interface Task {
  TaskId: string;
  Task: string;
  Status: string;
  DueDate: string;
  Assignees: string[];
  Followers: string[];
  UpdatedAt: string;
  isOverdue?: boolean;
}

export interface User {
  UserId: string;
  Name: string;
}
