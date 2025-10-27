# データベースマイグレーションガイド

## 概要

このドキュメントでは、パスワード認証機能を追加するためのデータベースマイグレーション手順を説明します。

## マイグレーション内容

### 変更内容

`users` テーブルに `password_hash` カラムを追加します。

```sql
ALTER TABLE users 
ADD COLUMN password_hash VARCHAR(255);
```

### 影響範囲

- **既存データへの影響**: なし（新しいカラムは NULL 許容）
- **既存機能への影響**: なし（既存の認証システムは引き続き動作）
- **ダウンタイム**: なし（カラム追加は即座に完了）

## マイグレーション実行方法

### 方法1: 専用マイグレーションスクリプト（推奨）

このスクリプトは冪等性があり、複数回実行しても安全です。

```bash
npm run db:migrate:password
```

**特徴:**
- カラムが既に存在する場合はスキップ
- エラーハンドリング付き
- 実行ログで進捗確認可能

### 方法2: Drizzle Kit Push

スキーマ全体を同期する方法です。

```bash
npm run db:push
```

**注意:**
- スキーマ全体の変更を適用
- 他の未適用の変更も同時に適用される

### 方法3: 手動SQL実行

データベースに直接接続して実行する方法です。

```sql
-- カラムが存在しない場合のみ追加
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
  END IF;
END $$;
```

## デプロイ時の実行

### ローカル環境

```bash
# 環境変数を設定
export DATABASE_URL="postgresql://user:password@localhost/database"

# マイグレーション実行
npm run db:migrate:password
```

### Render.com デプロイ時

`render.yaml` のビルドコマンドに含まれています：

```yaml
buildCommand: npm install && npm run build && npm run db:push
```

または、デプロイ後に手動実行：

```bash
# Render のシェルから実行
npm run db:migrate:password
```

### Neon Database での実行

Neon のSQL Editorから直接実行することも可能です：

1. Neon ダッシュボードにログイン
2. プロジェクトを選択
3. SQL Editor を開く
4. 上記の手動SQLを実行

## マイグレーション確認

マイグレーションが正常に完了したか確認する方法：

```sql
-- カラムの存在確認
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'password_hash';
```

期待される結果：

```
column_name   | data_type        | character_maximum_length | is_nullable
--------------+------------------+--------------------------+-------------
password_hash | character varying| 255                      | YES
```

## ロールバック

このマイグレーションをロールバックする必要がある場合：

```sql
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
```

**警告:** ロールバックすると、既に登録されたパスワードハッシュが失われます。

## トラブルシューティング

### エラー: "DATABASE_URL environment variable is not set"

**原因:** 環境変数が設定されていない

**解決方法:**
```bash
export DATABASE_URL="your-database-url"
```

### エラー: "column 'password_hash' already exists"

**原因:** カラムが既に存在している

**解決方法:** これは正常です。マイグレーションスクリプトは自動的にスキップします。

### エラー: "permission denied"

**原因:** データベースユーザーに ALTER TABLE 権限がない

**解決方法:** データベース管理者権限を持つユーザーで実行してください。

## 既存データの移行

既存のユーザーがいる場合、パスワードを設定する必要があります：

### オプション1: ユーザーに初回ログイン時にパスワード設定を促す

アプリケーション側で `password_hash` が NULL のユーザーを検出し、パスワード設定画面にリダイレクト。

### オプション2: 一時パスワードを設定

```sql
-- 注意: 実際のパスワードハッシュを使用してください
UPDATE users 
SET password_hash = '$2b$10$...' -- bcrypt ハッシュ
WHERE password_hash IS NULL;
```

## 参考情報

- スキーマ定義: `shared/schema.ts`
- マイグレーションスクリプト: `server/migrate-password-hash.ts`
- 認証実装: `server/auth.ts`
