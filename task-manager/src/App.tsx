import { useState } from "react";
import type { Task } from "./types/task";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { EditModal } from "./components/EditModal";
import { DeleteConfirm } from "./components/DeleteConfirm";

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    sortConfig,
    sortTasks,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleAddTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      addTask(taskData);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (id: string, updates: Partial<Task>) => {
    try {
      updateTask(id, updates);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      try {
        deleteTask(deletingTask.id);
        setDeletingTask(null);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* タスク編集モーダル */}
      <EditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
      />

      {/* 削除確認ダイアログ */}
      <DeleteConfirm
        isOpen={!!deletingTask}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(null)}
        taskTitle={deletingTask?.title || ""}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 タスク管理
          </h1>
          <p className="text-gray-600">今日やるべきことを管理しましょう</p>
        </header>

        {/* タスク追加フォーム */}
        <TaskForm onAddTask={handleAddTask} />

        {/* タスク一覧 */}
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onToggleComplete={toggleComplete}
          sortConfig={sortConfig}
          onSort={sortTasks}
        />
      </div>
    </div>
  );
}

export default App;
