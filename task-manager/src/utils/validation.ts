/**
 * タイトルが有効かどうかを検証します
 * 空文字列または空白文字のみの文字列は無効とします
 */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0;
}

/**
 * タイトルのバリデーションエラーメッセージを取得します
 */
export function getTitleErrorMessage(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return "タイトルを入力してください";
  }
  return null;
}
