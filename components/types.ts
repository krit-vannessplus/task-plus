export interface Task {
  TaskId: string;
  Task: string;
  Status: string;
  DueDate: string;
  Assignees: string[];
  Followers: string[];
  UpdatedAt: string;
}

export interface User {
  UserId: string;
  Name: string;
}
