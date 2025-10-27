# AEONモール訪問記録アプリ (MallCount)

AEONモールへの訪問を記録・管理するWebアプリケーションです。スマートフォンブラウザからアクセスして、訪問履歴を簡単に追跡できます。

## 🌐 本番環境

**URL**: デプロイ後、Render.comから提供されるURL（例: `https://your-app-name.onrender.com`）

**注意**: 無料プランを使用しているため、15分間非アクティブ時にスリープします。初回アクセス時は起動に30秒〜1分かかる場合があります。

## ✨ 機能

- 📱 スマートフォンブラウザ対応（iOS Safari / Android Chrome）
- 🔐 パスワード認証によるセキュアなログイン
- 🏢 全国のAEONモール一覧表示
- 📊 訪問回数の記録と管理
- 🗺️ 地域・都道府県別のフィルタリング
- 📅 最終訪問日の追跡
- 💾 PostgreSQLによるデータ永続化

## 🛠️ 技術スタック

### フロントエンド
- React 18
- TypeScript
- Wouter (ルーティング)
- TanStack Query (データフェッチング)
- Tailwind CSS (スタイリング)

### バックエンド
- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- Passport.js (認証)

### インフラ
- Render.com (ホスティング)
- Neon Database (PostgreSQL)

## 📋 前提条件

- Node.js 20以上
- npm または yarn
- PostgreSQLデータベース（ローカル開発用）

## 🚀 ローカル開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd mallcount
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env`ファイルをプロジェクトルートに作成し、以下の内容を設定します：

```bash
# データベース接続
DATABASE_URL=postgresql://localhost/aeon_mall_dev

# セッション暗号化キー（ランダムな文字列）
SESSION_SECRET=your-secret-key-here

# 開発環境
NODE_ENV=development

# ポート番号
PORT=5000
```

**SESSION_SECRETの生成方法**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. データベースのセットアップ

```bash
# データベースの作成（PostgreSQLがインストールされている場合）
createdb aeon_mall_dev

# スキーマの適用
npm run db:push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5000` にアクセスします。

## 📦 本番環境へのデプロイ

詳細なデプロイ手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### クイックスタート

1. **Neon Databaseのセットアップ**
   - [Neon](https://neon.tech/)でアカウント作成
   - 新しいプロジェクトを作成
   - 接続文字列（DATABASE_URL）を取得

2. **Render.comへのデプロイ**
   - [Render.com](https://render.com/)でアカウント作成
   - GitHubリポジトリを連携
   - Web Serviceを作成
   - 環境変数を設定：
     - `DATABASE_URL`: Neonから取得した接続文字列
     - `SESSION_SECRET`: ランダムな文字列
     - `NODE_ENV`: `production`

3. **デプロイの確認**
   - Renderが自動的にビルドとデプロイを実行
   - 提供されたURLにアクセスして動作確認

## 📱 使い方

### 初回利用

1. アプリケーションのURLにアクセス
2. 「新規登録」をクリック
3. メールアドレス、名前、パスワードを入力して登録
4. ログイン

### モール訪問の記録

1. ログイン後、モール一覧が表示されます
2. 地域や都道府県でフィルタリング可能
3. 訪問したモールの「訪問を記録」ボタンをクリック
4. 訪問回数が自動的にカウントされます
5. 「記録を削除」で訪問履歴を削除できます

## 🗂️ プロジェクト構造

```
mallcount/
├── client/                 # フロントエンドコード
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   └── lib/           # ユーティリティ
│   └── index.html
├── server/                 # バックエンドコード
│   ├── auth.ts            # 認証ロジック
│   ├── routes.ts          # APIルート
│   └── index.ts           # サーバーエントリーポイント
├── db/                     # データベース関連
│   ├── schema.ts          # Drizzleスキーマ定義
│   └── index.ts           # データベース接続
├── .kiro/                  # Kiro設定とスペック
│   └── specs/
│       └── free-web-deployment/  # デプロイ仕様書
├── DEPLOYMENT.md           # デプロイメントガイド
├── render.yaml             # Render.com設定
└── package.json
```

## 🔧 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバーの起動
npm start

# データベーススキーマの適用
npm run db:push

# データベーススキーマの生成
npm run db:generate

# データベーススタジオの起動
npm run db:studio
```

## 🐛 トラブルシューティング

### データベース接続エラー

**症状**: `Error: connect ECONNREFUSED`

**解決方法**:
- `DATABASE_URL`が正しく設定されているか確認
- PostgreSQLが起動しているか確認
- データベースが存在するか確認

### セッションが保持されない

**症状**: ログイン後すぐにログアウトされる

**解決方法**:
- `SESSION_SECRET`が設定されているか確認
- ブラウザのCookieが有効になっているか確認

### ビルドエラー

**症状**: `npm run build`が失敗する

**解決方法**:
- `node_modules`を削除して再インストール: `rm -rf node_modules && npm install`
- Node.jsのバージョンを確認（20以上が必要）

詳細なトラブルシューティングは [DEPLOYMENT.md](./DEPLOYMENT.md#トラブルシューティング) を参照してください。

## 📊 無料プランの制限事項

### Neon Database
- ストレージ: 0.5GB
- アクティブ時間: 月間100時間
- 非アクティブ時は自動スリープ

### Render.com
- メモリ: 512MB
- 15分間非アクティブ時に自動スリープ
- スリープからの復帰に30秒〜1分
- 月間750時間の稼働時間

**推奨される使用方法**:
- 個人利用または1〜2名の小規模利用に最適
- 初回アクセス時の待ち時間を考慮
- 重要なデータは定期的にバックアップ

## 🔒 セキュリティ

- パスワードはbcryptでハッシュ化
- セッションはHTTPOnly cookieで管理
- HTTPS通信（本番環境）
- 環境変数による機密情報の管理

## 📄 ライセンス

このプロジェクトは個人利用を目的としています。

## 🤝 貢献

バグ報告や機能リクエストは、GitHubのIssuesセクションで受け付けています。

## 📞 サポート

- **デプロイメントガイド**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Neon Documentation**: https://neon.tech/docs
- **Render Documentation**: https://render.com/docs

---

**開発者**: [Your Name]
**最終更新**: 2025年1月
