import { test, expect } from "@playwright/test";

/**
 * Feature: lightweight-task-manager, Property 5: LocalStorageからのデータ読み込み
 * 検証: 要件 2.1, 2.4
 */
test("ページをリロードしてもタスクデータが保持される", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "永続化テストタスク");
  await page.fill("#assignee", "田中太郎");
  await page.fill("#dueDate", "2025-12-25");
  await page.selectOption("#priority", "high");
  await page.fill("#description", "このタスクはリロード後も残るはず");
  await page.click('button[type="submit"]');

  // タスクが表示されることを確認
  await expect(page.getByText("永続化テストタスク")).toBeVisible();
  await expect(page.getByText("田中太郎")).toBeVisible();

  // ページをリロード
  await page.reload();

  // タスクが保持されていることを確認
  await expect(page.getByText("永続化テストタスク")).toBeVisible();
  await expect(page.getByText("田中太郎")).toBeVisible();
  await expect(page.getByText("2025/12/25")).toBeVisible();
});

/**
 * Feature: lightweight-task-manager, Property 4: タスク追加のラウンドトリップ
 * 検証: 要件 1.4
 */
test("タスクを追加するとLocalStorageに保存される", async ({ page }) => {
  await page.goto("/");

  // LocalStorageをクリア
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // タスクを追加
  await page.fill("#title", "LocalStorageテスト");
  await page.fill("#assignee", "山本花子");
  await page.click('button[type="submit"]');

  // LocalStorageにデータが保存されていることを確認
  const storageData = await page.evaluate(() => {
    const data = localStorage.getItem("lightweight-task-manager-tasks");
    return data ? JSON.parse(data) : null;
  });

  expect(storageData).toBeTruthy();
  expect(Array.isArray(storageData)).toBe(true);
  expect(storageData.length).toBe(1);
  expect(storageData[0].title).toBe("LocalStorageテスト");
  expect(storageData[0].assignee).toBe("山本花子");
});

test("複数のタスクを追加・編集・削除してもデータの整合性が保たれる", async ({
  page,
}) => {
  await page.goto("/");

  // LocalStorageをクリア
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 複数のタスクを追加
  await page.fill("#title", "タスク1");
  await page.click('button[type="submit"]');

  await page.fill("#title", "タスク2");
  await page.click('button[type="submit"]');

  await page.fill("#title", "タスク3");
  await page.click('button[type="submit"]');

  // 3つのタスクが表示されることを確認
  await expect(page.getByText("タスク1")).toBeVisible();
  await expect(page.getByText("タスク2")).toBeVisible();
  await expect(page.getByText("タスク3")).toBeVisible();

  // タスク2を編集
  const task2Row = page.locator("tr", { hasText: "タスク2" });
  await task2Row.locator('button:has-text("編集")').click();
  await page.fill("#edit-title", "タスク2（編集済み）");
  await page.locator('button[type="submit"]:has-text("保存")').click();

  // タスク1を削除
  const task1Row = page.locator("tr", { hasText: "タスク1" });
  await task1Row.locator('button:has-text("削除")').click();
  await page.locator('button[type="button"]:has-text("削除")').last().click();

  // ページをリロード
  await page.reload();

  // データの整合性を確認
  await expect(page.getByText("タスク1")).not.toBeVisible();
  await expect(page.getByText("タスク2（編集済み）")).toBeVisible();
  await expect(page.getByText("タスク3")).toBeVisible();

  // LocalStorageのデータを確認
  const storageData = await page.evaluate(() => {
    const data = localStorage.getItem("lightweight-task-manager-tasks");
    return data ? JSON.parse(data) : null;
  });

  expect(storageData.length).toBe(2);
  expect(
    storageData.find((t: any) => t.title === "タスク2（編集済み）")
  ).toBeTruthy();
  expect(storageData.find((t: any) => t.title === "タスク3")).toBeTruthy();
  expect(storageData.find((t: any) => t.title === "タスク1")).toBeFalsy();
});

test("完了状態の変更もLocalStorageに保存される", async ({ page }) => {
  await page.goto("/");

  // LocalStorageをクリア
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // タスクを追加
  await page.fill("#title", "完了テストタスク");
  await page.click('button[type="submit"]');

  // 完了チェックボックスをクリック
  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.click();

  // ページをリロード
  await page.reload();

  // 完了状態が保持されていることを確認
  const checkboxAfterReload = page.locator('input[type="checkbox"]').first();
  await expect(checkboxAfterReload).toBeChecked();

  // LocalStorageのデータを確認
  const storageData = await page.evaluate(() => {
    const data = localStorage.getItem("lightweight-task-manager-tasks");
    return data ? JSON.parse(data) : null;
  });

  expect(storageData[0].completed).toBe(true);
});
