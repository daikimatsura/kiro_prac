export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SortConfig {
  key: keyof Task | null;
  direction: "asc" | "desc";
}
