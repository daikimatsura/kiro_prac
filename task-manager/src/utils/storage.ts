import type { Task } from "../types/task";

const STORAGE_KEY = "lightweight-task-manager-tasks";

/**
 * LocalStorageが利用可能かチェックします
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * LocalStorageからタスクを読み込みます
 */
export function loadTasks(): Task[] {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("LocalStorageが利用できません");
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const tasks = JSON.parse(data);

    // データの整合性を検証
    if (!Array.isArray(tasks)) {
      console.error("LocalStorageのデータが不正です");
      return [];
    }

    // 各タスクの必須フィールドを検証
    return tasks.filter((task: any) => {
      return (
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.assignee === "string" &&
        (task.dueDate === null || typeof task.dueDate === "string") &&
        ["low", "medium", "high"].includes(task.priority) &&
        ["todo", "in-progress", "completed"].includes(task.status) &&
        typeof task.description === "string" &&
        typeof task.completed === "boolean" &&
        typeof task.createdAt === "string" &&
        typeof task.updatedAt === "string"
      );
    });
  } catch (error) {
    console.error("タスクの読み込みに失敗しました:", error);
    return [];
  }
}

/**
 * LocalStorageにタスクを保存します
 */
export function saveTasks(tasks: Task[]): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      throw new Error(
        "LocalStorageが利用できません。プライベートブラウジングモードを終了してください。"
      );
    }

    const data = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.error("LocalStorageの容量が不足しています");
      throw new Error(
        "保存容量が不足しています。不要なタスクを削除してください。"
      );
    }
    console.error("タスクの保存に失敗しました:", error);
    throw error;
  }
}

/**
 * LocalStorageからタスクを削除します
 */
export function clearTasks(): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("タスクのクリアに失敗しました:", error);
  }
}
