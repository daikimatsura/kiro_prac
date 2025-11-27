import { test, expect } from "@playwright/test";

/**
 * Feature: lightweight-task-manager, Property 1: タスク追加でリストが成長する
 * 検証: 要件 1.1
 */
test("タスクを追加するとリストが成長する", async ({ page }) => {
  await page.goto("/");

  // 初期状態を確認
  const emptyMessage = page.getByText("タスクがありません");
  await expect(emptyMessage).toBeVisible();

  // タスクを追加
  await page.fill("#title", "テストタスク1");
  await page.fill("#assignee", "山田太郎");
  await page.fill("#dueDate", "2025-12-31");
  await page.selectOption("#priority", "high");
  await page.selectOption("#status", "in-progress");
  await page.fill("#description", "これはテストタスクです");
  await page.click('button[type="submit"]');

  // タスクが表示されることを確認
  await expect(page.getByText("テストタスク1")).toBeVisible();
  await expect(emptyMessage).not.toBeVisible();

  // もう1つタスクを追加
  await page.fill("#title", "テストタスク2");
  await page.click('button[type="submit"]');

  // 2つのタスクが表示されることを確認
  await expect(page.getByText("テストタスク1")).toBeVisible();
  await expect(page.getByText("テストタスク2")).toBeVisible();
});

/**
 * Feature: lightweight-task-manager, Property 8: タスク更新が反映される
 * 検証: 要件 3.2
 */
test("タスクを編集すると変更が反映される", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "編集前のタスク");
  await page.fill("#assignee", "佐藤花子");
  await page.click('button[type="submit"]');

  // タスクが表示されることを確認
  await expect(page.getByText("編集前のタスク")).toBeVisible();

  // 編集ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "編集前のタスク" });
  await taskRow.locator('button:has-text("編集")').click();

  // モーダルが表示されることを確認
  await expect(page.getByText("タスクを編集")).toBeVisible();

  // タスクを編集
  await page.fill("#edit-title", "編集後のタスク");
  await page.fill("#edit-assignee", "鈴木一郎");
  await page.selectOption("#edit-priority", "low");

  // 保存ボタンをクリック
  await page.locator('button[type="submit"]:has-text("保存")').click();

  // 変更が反映されることを確認
  await expect(page.getByText("編集後のタスク")).toBeVisible();
  await expect(page.getByText("鈴木一郎")).toBeVisible();
  await expect(page.getByText("編集前のタスク")).not.toBeVisible();
});

/**
 * Feature: lightweight-task-manager, Property 13: 削除でタスクが消える
 * 検証: 要件 4.2
 */
test("タスクを削除するとリストから消える", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "削除するタスク");
  await page.click('button[type="submit"]');

  // タスクが表示されることを確認
  await expect(page.getByText("削除するタスク")).toBeVisible();

  // 削除ボタンをクリック
  const deleteTaskRow = page.locator("tr", { hasText: "削除するタスク" });
  await deleteTaskRow.locator('button:has-text("削除")').click();

  // 確認ダイアログが表示されることを確認
  await expect(page.getByText("タスクを削除")).toBeVisible();
  await expect(
    page.getByText("「削除するタスク」を削除してもよろしいですか？")
  ).toBeVisible();

  // 削除を確認
  await page.click('button:has-text("削除")');

  // タスクが消えることを確認（テーブル内のタスクが消えることを確認）
  const taskInTable = page.locator("tbody tr", { hasText: "削除するタスク" });
  await expect(taskInTable).not.toBeVisible();
  await expect(page.getByText("タスクがありません")).toBeVisible();
});

/**
 * Feature: lightweight-task-manager, Property 15: 完了チェックでステータスが変更される
 * 検証: 要件 5.1
 */
test("完了チェックボックスをクリックするとタスクが完了状態になる", async ({
  page,
}) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "完了するタスク");
  await page.click('button[type="submit"]');

  // タスクが表示されることを確認
  const taskRow = page.locator("tr", { hasText: "完了するタスク" });
  await expect(taskRow).toBeVisible();

  // 完了チェックボックスをクリック
  const checkbox = taskRow.locator('input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
  await checkbox.click();

  // チェックボックスがチェックされることを確認
  await expect(checkbox).toBeChecked();

  // タスクに打ち消し線が適用されることを確認（視覚的変化）
  const taskTitle = taskRow.locator('td:has-text("完了するタスク")');
  await expect(taskTitle).toHaveClass(/line-through/);
});
