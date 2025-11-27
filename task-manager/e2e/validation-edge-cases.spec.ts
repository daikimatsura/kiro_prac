import { test, expect } from "@playwright/test";

/**
 * Feature: lightweight-task-manager, Property 2: 無効なタイトルは拒否される
 * 検証: 要件 1.2
 */
test("空のタイトルでタスクを追加しようとするとエラーが表示される", async ({
  page,
}) => {
  await page.goto("/");

  // タイトルを空のまま追加ボタンをクリック
  await page.click('button[type="submit"]');

  // エラーメッセージが表示されることを確認
  await expect(page.getByText("タイトルを入力してください")).toBeVisible();

  // タスクが追加されていないことを確認
  await expect(page.getByText("タスクがありません")).toBeVisible();
});

test("空白文字のみのタイトルでタスクを追加しようとするとエラーが表示される", async ({
  page,
}) => {
  await page.goto("/");

  // 空白文字のみを入力
  await page.fill("#title", "   ");
  await page.click('button[type="submit"]');

  // エラーメッセージが表示されることを確認
  await expect(page.getByText("タイトルを入力してください")).toBeVisible();

  // タスクが追加されていないことを確認
  await expect(page.getByText("タスクがありません")).toBeVisible();
});

test("編集時に空のタイトルにしようとするとエラーが表示される", async ({
  page,
}) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "編集テストタスク");
  await page.click('button[type="submit"]');

  // 編集ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "編集テストタスク" });
  await taskRow.locator('button:has-text("編集")').click();

  // モーダルが表示されるまで待機
  await expect(page.getByText("タスクを編集")).toBeVisible();

  // タイトルを空にして保存しようとする
  await page.fill("#edit-title", "");
  await page.click('button[type="submit"]');

  // エラーメッセージが表示されることを確認
  await expect(page.getByText("タイトルを入力してください")).toBeVisible();

  // モーダルが閉じていないことを確認
  await expect(page.getByText("タスクを編集")).toBeVisible();
});

/**
 * Feature: lightweight-task-manager, Property 3: 追加後にフォームがクリアされる
 * 検証: 要件 1.3
 */
test("タスクを追加するとフォームがクリアされる", async ({ page }) => {
  await page.goto("/");

  // フォームに入力
  await page.fill("#title", "クリアテストタスク");
  await page.fill("#assignee", "田中");
  await page.fill("#dueDate", "2025-12-31");
  await page.selectOption("#priority", "high");
  await page.selectOption("#status", "in-progress");
  await page.fill("#description", "テスト説明");

  // タスクを追加
  await page.click('button[type="submit"]');

  // フォームがクリアされていることを確認
  await expect(page.locator("#title")).toHaveValue("");
  await expect(page.locator("#assignee")).toHaveValue("");
  await expect(page.locator("#dueDate")).toHaveValue("");
  await expect(page.locator("#priority")).toHaveValue("medium"); // デフォルト値
  await expect(page.locator("#status")).toHaveValue("todo"); // デフォルト値
  await expect(page.locator("#description")).toHaveValue("");
});

test("空状態が適切に表示される", async ({ page }) => {
  await page.goto("/");

  // LocalStorageをクリア
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 空状態のメッセージが表示されることを確認
  await expect(page.getByText("タスクがありません")).toBeVisible();
  await expect(
    page.getByText("上のフォームから新しいタスクを追加してください")
  ).toBeVisible();

  // アイコンが表示されることを確認
  const emptyIcon = page.locator("svg").first();
  await expect(emptyIcon).toBeVisible();
});

test("削除確認ダイアログでキャンセルするとタスクが保持される", async ({
  page,
}) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "キャンセルテストタスク");
  await page.click('button[type="submit"]');

  // 削除ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "キャンセルテストタスク" });
  await taskRow.locator('button:has-text("削除")').click();

  // 確認ダイアログが表示されることを確認
  await expect(page.getByText("タスクを削除")).toBeVisible();

  // キャンセルボタンをクリック
  const cancelButton = page.locator('button:has-text("キャンセル")').last();
  await cancelButton.click();

  // タスクが保持されていることを確認
  await expect(page.getByText("キャンセルテストタスク")).toBeVisible();
});

test("編集モーダルでキャンセルすると変更が破棄される", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "元のタイトル");
  await page.fill("#assignee", "元の担当者");
  await page.click('button[type="submit"]');

  // 編集ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "元のタイトル" });
  await taskRow.locator('button:has-text("編集")').click();

  // モーダルが表示されるまで待機
  await expect(page.getByText("タスクを編集")).toBeVisible();

  // タスクを編集
  await page.fill("#edit-title", "変更後のタイトル");
  await page.fill("#edit-assignee", "変更後の担当者");

  // キャンセルボタンをクリック
  const cancelButton = page.locator('button:has-text("キャンセル")').first();
  await cancelButton.click();

  // 元のデータが保持されていることを確認
  await expect(page.getByText("元のタイトル")).toBeVisible();
  await expect(page.getByText("元の担当者")).toBeVisible();
  await expect(page.getByText("変更後のタイトル")).not.toBeVisible();
});

test("Escapeキーで編集モーダルを閉じることができる", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "Escapeテストタスク");
  await page.click('button[type="submit"]');

  // 編集ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "Escapeテストタスク" });
  await taskRow.locator('button:has-text("編集")').click();

  // モーダルが表示されることを確認
  await expect(page.getByText("タスクを編集")).toBeVisible();

  // Escapeキーを押す
  await page.keyboard.press("Escape");

  // モーダルが閉じることを確認
  await expect(page.getByText("タスクを編集")).not.toBeVisible();
});

test("Escapeキーで削除確認ダイアログを閉じることができる", async ({ page }) => {
  await page.goto("/");

  // タスクを追加
  await page.fill("#title", "Escapeテストタスク2");
  await page.click('button[type="submit"]');

  // 削除ボタンをクリック
  const taskRow = page.locator("tr", { hasText: "Escapeテストタスク2" });
  await taskRow.locator('button:has-text("削除")').click();

  // ダイアログが表示されることを確認
  await expect(page.getByText("タスクを削除")).toBeVisible();

  // Escapeキーを押す
  await page.keyboard.press("Escape");

  // ダイアログが閉じることを確認
  await expect(page.getByText("タスクを削除")).not.toBeVisible();

  // タスクが保持されていることを確認
  await expect(page.getByText("Escapeテストタスク2")).toBeVisible();
});
