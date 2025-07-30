import axios from "axios";
import { Task } from "@/components/types";

export default async function getData(userId: string): Promise<Task[]> {
  // Fetch data from your API here.
  const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;
  try {
    const resp = await axios.get(GAS_URL, {
      params: {
        action: "getTasksFor",
        payload: JSON.stringify({ UserId: userId }),
      },
    });
    // Ensure resp.data is an array
    const tasks = resp.data || [];
    tasks.forEach((task: Task) => {
      if (task.DueDate) {
        console.log("Task DueDate:", new Date(task.DueDate));
        console.log("Current Date:", new Date());
        task.isOverdue = new Date(task.DueDate) <= new Date();
      }
    });
    // Log the fetched tasks for debugging
    console.log("Fetched tasks:", tasks); // For debugging
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  return [];
}
