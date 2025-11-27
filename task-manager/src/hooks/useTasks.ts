import { useState, useMemo } from "react";
import type { Task, SortConfig } from "../types/task";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "lightweight-task-manager-tasks";

/**
 * タスク管理のカスタムフック
 */
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  /**
   * 新しいタスクを追加
   */
  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks([...tasks, newTask]);
  };

  /**
   * タスクを更新
   */
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  /**
   * タスクを削除
   */
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  /**
   * タスクの完了状態を切り替え
   */
  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "completed" : task.status,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  /**
   * ソート設定を変更
   */
  const sortTasks = (key: keyof Task) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  /**
   * ソートされたタスクリスト
   */
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) {
      return tasks;
    }

    return [...tasks].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // null値の処理
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      // 優先度の特別な処理
      if (sortConfig.key === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        const aOrder = priorityOrder[aValue as "low" | "medium" | "high"];
        const bOrder = priorityOrder[bValue as "low" | "medium" | "high"];
        return sortConfig.direction === "asc"
          ? aOrder - bOrder
          : bOrder - aOrder;
      }

      // 文字列と日付の比較
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue, "ja-JP", { sensitivity: "base" })
          : bValue.localeCompare(aValue, "ja-JP", { sensitivity: "base" });
      }

      // その他の型の比較
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortConfig]);

  return {
    tasks: sortedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    sortConfig,
    sortTasks,
  };
}
