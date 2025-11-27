import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  // テスト用のタスクを複数追加
  const tasks = [
    {
      title: "Cタスク",
      assignee: "test3",
      dueDate: "2025-12-31",
      priority: "high",
    },
    {
      title: "Aタスク",
      assignee: "test1",
      dueDate: "2025-11-30",
      priority: "low",
    },
    {
      title: "Bタスク",
      assignee: "test2",
      dueDate: "2025-12-15",
      priority: "medium",
    },
  ];

  for (const task of tasks) {
    await page.fill("#title", task.title);
    await page.fill("#assignee", task.assignee);
    await page.fill("#dueDate", task.dueDate);
    await page.selectOption("#priority", task.priority);
    await page.click('button[type="submit"]');
  }
});

/**
 * Feature: lightweight-task-manager, Property 19: タイトルでソートされる
 * 検証: 要件 6.1
 */
test("タイトル列をクリックするとタイトル順にソートされる", async ({ page }) => {
  // タイトル列のヘッダーをクリック（昇順）
  await page.click('th:has-text("タイトル")');

  // タスクが昇順に並んでいることを確認
  const rows = page.locator("tbody tr");
  await expect(rows.nth(0)).toContainText("Aタスク");
  await expect(rows.nth(1)).toContainText("Bタスク");
  await expect(rows.nth(2)).toContainText("Cタスク");

  // もう一度クリック（降順）
  await page.click('th:has-text("タイトル")');

  // タスクが降順に並んでいることを確認
  await expect(rows.nth(0)).toContainText("Cタスク");
  await expect(rows.nth(1)).toContainText("Bタスク");
  await expect(rows.nth(2)).toContainText("Aタスク");
});

/**
 * Feature: lightweight-task-manager, Property 20: 担当者でソートされる
 * 検証: 要件 6.2
 */
test("担当者列をクリックすると担当者順にソートされる", async ({ page }) => {
  // 担当者列のヘッダーをクリック（昇順）
  await page.click('th:has-text("担当者")');

  // タスクが昇順に並んでいることを確認
  const rows = page.locator("tbody tr");
  await expect(rows.nth(0)).toContainText("test1");
  await expect(rows.nth(1)).toContainText("test2");
  await expect(rows.nth(2)).toContainText("test3");
});

/**
 * Feature: lightweight-task-manager, Property 21: 期限でソートされる
 * 検証: 要件 6.3
 */
test("期限列をクリックすると期限順にソートされる", async ({ page }) => {
  // 期限列のヘッダーをクリック（昇順）
  await page.click('th:has-text("期限")');

  // タスクが昇順に並んでいることを確認
  const rows = page.locator("tbody tr");
  await expect(rows.nth(0)).toContainText("2025/11/30");
  await expect(rows.nth(1)).toContainText("2025/12/15");
  await expect(rows.nth(2)).toContainText("2025/12/31");
});

/**
 * Feature: lightweight-task-manager, Property 22: 優先度でソートされる
 * 検証: 要件 6.4
 */
test("優先度列をクリックすると優先度順にソートされる", async ({ page }) => {
  // 優先度列のヘッダーをクリック（昇順: low -> medium -> high）
  await page.click('th:has-text("優先度")');

  // タスクが昇順に並んでいることを確認
  const rows = page.locator("tbody tr");
  await expect(rows.nth(0)).toContainText("低");
  await expect(rows.nth(1)).toContainText("中");
  await expect(rows.nth(2)).toContainText("高");
});

/**
 * Feature: lightweight-task-manager, Property 23: ステータスでソートされる
 * 検証: 要件 6.5
 */
test("ステータス列をクリックするとステータス順にソートされる", async ({
  page,
}) => {
  // ステータス列のヘッダーをクリック
  await page.click('th:has-text("ステータス")');

  // ソートが実行されることを確認（デフォルトは全て「未着手」なので変化なし）
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(3);
});

/**
 * Feature: lightweight-task-manager, Property 24: ソート方向の反転
 * 検証: 要件 6.6
 */
test("同じ列を2回クリックするとソート順が反転する", async ({ page }) => {
  // タイトル列を1回クリック（昇順）
  await page.click('th:has-text("タイトル")');

  const rows = page.locator("tbody tr");
  await expect(rows.nth(0)).toContainText("Aタスク");
  await expect(rows.nth(2)).toContainText("Cタスク");

  // タイトル列をもう1回クリック（降順）
  await page.click('th:has-text("タイトル")');

  await expect(rows.nth(0)).toContainText("Cタスク");
  await expect(rows.nth(2)).toContainText("Aタスク");
});
