# イオンモール訪問カウンター (MallCount)

全国のイオンモールおよび関連施設（OPA、アウトレット等）への訪問を記録・管理するWebアプリケーションです。

## 🌐 本番環境

**URL**: https://mallcount.onrender.com

**注意**: 無料プランを使用しているため、15分間非アクティブ時にスリープします。初回アクセス時は起動に30秒〜1分かかる場合があります。

## ✨ 機能

- 📱 スマートフォン・PC対応（レスポンシブデザイン）
- 🔐 ユーザー認証とセキュアなログイン
- 🏢 全国166施設の管理
  - イオンモール
  - OPA（15店舗）
  - アウトレットモール（4店舗）
  - その他関連施設
- ➕ 訪問回数の記録と削除
- 📊 訪問統計の表示
  - 総訪問回数
  - 訪問モール数
  - 最多訪問モール
  - 今月の訪問回数
- 🗺️ 地域・都道府県別のフィルタリング（9地域対応）
- 🔍 施設名・都道府県での検索機能
- 📅 最終訪問日の自動記録
- 💾 PostgreSQLによるデータ永続化

## 🛠️ 技術スタック

### フロントエンド
- React 18
- TypeScript
- Wouter (ルーティング)
- TanStack Query (データフェッチング)
- Tailwind CSS + shadcn/ui (UIコンポーネント)

### バックエンド
- Node.js 22
- Express
- Drizzle ORM
- Passport.js (認証)
- bcrypt (パスワードハッシュ化)

### データベース
- Neon PostgreSQL

### デプロイメント
- Render.com (ホスティング)
- GitHub (CI/CD)

## 📋 前提条件

- Node.js 22以上
- npm
- PostgreSQLデータベース（ローカル開発用）または Neon Database

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
# Neon Databaseを使用する場合は、DATABASE_URLを設定してから実行

# スキーマの適用
npm run db:push

# 初期データの投入（166施設のデータ）
npm run seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5000` にアクセスします。

## 📦 本番環境へのデプロイ

本アプリケーションは既にデプロイ済みです: https://mallcount.onrender.com

新規デプロイまたは詳細な手順については [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### デプロイメント概要

1. **Neon Database**: PostgreSQLホスティング
   - プロジェクト名: aeon-mall-tracker
   - データベース: neondb

2. **Render.com**: Webアプリケーションホスティング
   - サービス名: MallCount
   - 自動デプロイ: GitHubプッシュ時
   - ビルドコマンド: `npm ci && npm run build && npm run db:push`

3. **初期データ投入**: デプロイ後、必要に応じて手動で実行
   ```bash
   npm run seed
   ```

## 📱 使い方

### 初回利用

1. https://mallcount.onrender.com にアクセス
2. 「新規登録」から登録
3. メールアドレス、名前、パスワードを入力
4. ログイン完了

### 訪問記録の管理

1. **施設を探す**
   - 検索バーで施設名や都道府県で検索
   - 地域タブで絞り込み（北海道、東北、関東など）
   - 並び替え（名前順/訪問回数順）

2. **訪問を記録**
   - 訪問した施設の「追加」ボタンをクリック
   - 訪問回数が自動的にカウント
   - 最終訪問日が更新

3. **記録を削除**
   - 「削除」ボタンで訪問回数を1回減らす
   - 0回になると最終訪問日もクリア

4. **統計を確認**
   - トップの統計カードで訪問実績を確認
   - 総訪問回数、訪問モール数、最多訪問モール、今月の訪問数

## 🗂️ プロジェクト構造

```
mallcount/
├── client/                 # フロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント
│   │   │   ├── ui/       # shadcn/uiコンポーネント
│   │   │   └── ...       # アプリケーションコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   └── lib/           # ユーティリティ
│   └── index.html
├── server/                 # バックエンド
│   ├── index.ts           # サーバーエントリーポイント
│   ├── routes.ts          # APIルート
│   ├── auth.ts            # 認証ロジック
│   ├── db.ts              # データベース接続
│   └── seed.ts            # 初期データ投入スクリプト
├── shared/                 # 共有コード
│   └── schema.ts          # データベーススキーマ（Drizzle ORM）
├── DEPLOYMENT.md           # デプロイメントガイド
├── render.yaml             # Render.com設定
└── package.json
```

## 🔧 利用可能なスクリプト

```bash
# 開発サーバーの起動（ポート5000）
npm run dev

# 本番ビルド
npm run build

# 本番サーバーの起動
npm start

# TypeScriptの型チェック
npm run check

# データベーススキーマの適用
npm run db:push

# 初期データの投入（166施設）
npm run seed
```

## 🐛 トラブルシューティング

### データベース接続エラー

**症状**: `Error: connect ECONNREFUSED`

**解決方法**:
- `DATABASE_URL`が正しく設定されているか確認
- Neon Databaseが起動しているか確認（無料プランは一定時間後にスリープ）
- Neon Databaseのコンソールで接続文字列を再確認

### セッションが保持されない

**症状**: ログイン後すぐにログアウトされる

**解決方法**:
- `SESSION_SECRET`が設定されているか確認
- ブラウザのCookieが有効になっているか確認

### ビルドエラー

**症状**: `npm run build`が失敗する

**解決方法**:
- `node_modules`を削除して再インストール: `rm -rf node_modules && npm install`
- Node.jsのバージョンを確認（22以上が必要）
- キャッシュをクリア: `npm cache clean --force`

詳細なトラブルシューティングは [DEPLOYMENT.md](./DEPLOYMENT.md#トラブルシューティング) を参照してください。

## 📊 無料プランの制限事項と推奨事項

### Neon Database（無料プラン）
- ストレージ: 0.5GB
- アクティブ時間: 月間100時間
- 非アクティブ時は自動スリープ
- データベース数: 10個まで

### Render.com（無料プラン）
- メモリ: 512MB
- CPU: 共有
- 15分間非アクティブ時に自動スリープ
- スリープからの復帰に30秒〜1分
- 月間750時間の稼働時間
- カスタムドメイン対応

**推奨される使用方法**:
- 個人利用または小規模グループでの利用に最適
- 初回アクセス時の待ち時間（コールドスタート）を考慮
- データは安全に保存されますが、重要な記録は定期的にバックアップを推奨

## 🔒 セキュリティ

- パスワードはbcryptでハッシュ化（ソルト10ラウンド）
- セッションはHTTPOnly cookieで管理（CSRF対策）
- HTTPS通信（本番環境）
- 環境変数による機密情報の管理
- SQL Injection対策（Drizzle ORMによるパラメータ化クエリ）

## � データ仕様

### 収録施設（2025年1月時点）
- **総施設数**: 166
- **イオンモール**: 約150施設
- **OPA**: 15施設（秋田、水戸、河原町、三宮、心斎橋など）
- **アウトレット**: 4施設（THE OUTLETS HIROSHIMA、KITAKYUSHU、SHONAN HIRATSUKAなど）
- **その他**: ビブレ、フォーラス、umieなど

### データ更新
施設の開業・閉業情報は定期的に更新されます。更新は `server/seed.ts` で管理しています。

## 📄 ライセンス

MIT License - 個人利用・商用利用可能

## 🤝 貢献

バグ報告や機能リクエストは、GitHubのIssuesで受け付けています。

## 📞 サポート・ドキュメント

- **本番環境**: https://mallcount.onrender.com
- **デプロイメントガイド**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Neon Documentation**: https://neon.tech/docs
- **Render Documentation**: https://render.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

**最終更新**: 2025年10月29日
**施設データ更新**: 2025年1月
