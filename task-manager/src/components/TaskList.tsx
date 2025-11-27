import type { Task, SortConfig } from "../types/task";
import { TaskItem } from "./TaskItem";
import { SortableHeader } from "./SortableHeader";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Task) => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  sortConfig,
  onSort,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            タスクがありません
          </h3>
          <p className="text-gray-600">
            上のフォームから新しいタスクを追加してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                完了
              </th>
              <SortableHeader
                label="タイトル"
                sortKey="title"
                currentSort={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="担当者"
                sortKey="assignee"
                currentSort={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="期限"
                sortKey="dueDate"
                currentSort={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="優先度"
                sortKey="priority"
                currentSort={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="ステータス"
                sortKey="status"
                currentSort={sortConfig}
                onSort={onSort}
              />
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
