import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { isValidTitle, getTitleErrorMessage } from "../utils/validation";

interface EditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => void;
}

export function EditModal({ task, isOpen, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"todo" | "in-progress" | "completed">(
    "todo"
  );
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // タスクが変更されたらフォームを更新
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setAssignee(task.assignee);
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setPriority(task.priority);
      setStatus(task.status);
      setDescription(task.description);
      setError(null);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) return;

    // バリデーション
    if (!isValidTitle(title)) {
      setError(getTitleErrorMessage(title));
      return;
    }

    // タスクを更新
    onSave(task.id, {
      title: title.trim(),
      assignee: assignee.trim(),
      dueDate: dueDate || null,
      priority,
      status,
      description: description.trim(),
    });

    onClose();
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
              ✏️ タスクを編集
            </h3>
          </div>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-assignee"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  担当者
                </label>
                <input
                  type="text"
                  id="edit-assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-dueDate"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  期限
                </label>
                <input
                  type="date"
                  id="edit-dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-priority"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  優先度
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "low" | "medium" | "high")
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="low">🟢 低</option>
                  <option value="medium">🟡 中</option>
                  <option value="high">🔴 高</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  ステータス
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "todo" | "in-progress" | "completed"
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="todo">📝 未着手</option>
                  <option value="in-progress">⚡ 進行中</option>
                  <option value="completed">✅ 完了</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="edit-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                説明
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
