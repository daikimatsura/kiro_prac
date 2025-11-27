import { defineBackend } from "@aws-amplify/backend";

// フロントエンドのみのアプリケーションのため、
// バックエンドリソースは定義しません
const backend = defineBackend({});
