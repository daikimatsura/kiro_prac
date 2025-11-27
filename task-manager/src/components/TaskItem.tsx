import type { Task } from "../types/task";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  const priorityConfig = {
    low: { color: "text-green-700 bg-green-100", label: "🟢 低", icon: "🟢" },
    medium: {
      color: "text-yellow-700 bg-yellow-100",
      label: "🟡 中",
      icon: "🟡",
    },
    high: { color: "text-red-700 bg-red-100", label: "🔴 高", icon: "🔴" },
  };

  const statusConfig = {
    todo: { color: "text-gray-700 bg-gray-100", label: "📝 未着手" },
    "in-progress": {
      color: "text-blue-700 bg-blue-100",
      label: "⚡ 進行中",
    },
    completed: { color: "text-green-700 bg-green-100", label: "✅ 完了" },
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy/MM/dd", { locale: ja });
    } catch {
      return "-";
    }
  };

  // 完了ステータスかどうかを判定
  const isCompleted = task.status === "completed";

  return (
    <tr
      className={`transition-all duration-150 ${
        isCompleted ? "bg-gray-200 hover:bg-gray-300" : "hover:bg-blue-50"
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          aria-label={`${task.title}を完了にする`}
        />
      </td>
      <td
        className={`px-6 py-4 ${
          isCompleted ? "line-through text-gray-600" : "text-gray-900"
        }`}
      >
        <div className="font-semibold text-base">{task.title}</div>
        {task.description && (
          <div className="text-sm text-gray-600 mt-1 line-clamp-2">
            {task.description}
          </div>
        )}
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm ${isCompleted ? "text-gray-600" : "text-gray-700"}`}
      >
        {task.assignee ? (
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${isCompleted ? "bg-gray-400" : "bg-linear-to-br from-blue-400 to-purple-500"} flex items-center justify-center text-white font-semibold text-xs mr-2`}
            >
              {task.assignee.charAt(0)}
            </div>
            {task.assignee}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm ${isCompleted ? "text-gray-600" : "text-gray-700"}`}
      >
        {task.dueDate ? (
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(task.dueDate)}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            priorityConfig[task.priority].color
          }`}
        >
          {priorityConfig[task.priority].label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            statusConfig[task.status].color
          }`}
        >
          {statusConfig[task.status].label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-900 mr-4 transition-colors font-semibold hover:underline"
          aria-label={`${task.title}を編集`}
          data-testid={`edit-task-${task.id}`}
        >
          編集
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-red-600 hover:text-red-900 transition-colors font-semibold hover:underline"
          aria-label={`${task.title}を削除`}
          data-testid={`delete-task-${task.id}`}
        >
          削除
        </button>
      </td>
    </tr>
  );
}
