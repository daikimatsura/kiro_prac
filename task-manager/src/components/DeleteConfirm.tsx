import { useEffect } from "react";

interface DeleteConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  taskTitle: string;
}

export function DeleteConfirm({
  isOpen,
  onConfirm,
  onCancel,
  taskTitle,
}: DeleteConfirmProps) {
  // Escapeキーでキャンセル
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-red-100">
              <svg
                className="h-7 w-7 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3
                className="text-xl font-bold text-gray-900 mb-2"
                id="modal-title"
              >
                タスクを削除
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  「
                  <span className="font-semibold text-gray-900">
                    {taskTitle}
                  </span>
                  」を削除してもよろしいですか？
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  この操作は取り消せません。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all"
            data-testid="confirm-delete"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
