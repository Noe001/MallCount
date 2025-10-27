# Render.com デプロイ手順

このドキュメントでは、Render.comへのデプロイに必要な手動ステップを説明します。

## ✅ 完了した準備作業

- GitHubリポジトリの準備完了
- `.gitignore`の更新（.env、node_modules等を除外）
- 認証システムの実装
- デプロイ設定ファイル（render.yaml）の作成
- ドキュメント（DEPLOYMENT.md）の作成
- コードのコミットとプッシュ完了

## 📋 次に実行する手順

### ステップ1: Neon Database のセットアップ

#### 1.1 Neonアカウントの作成
1. https://neon.tech/ にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでサインアップ（推奨）

#### 1.2 新しいプロジェクトの作成
1. Neonダッシュボードで「New Project」をクリック
2. 以下の設定を入力：
   - **プロジェクト名**: `aeon-mall-tracker`（または任意の名前）
   - **リージョン**: `AWS Asia Pacific (Tokyo)`（日本に近いリージョン）
   - **PostgreSQLバージョン**: 最新版（デフォルト）
3. 「Create Project」をクリック

#### 1.3 DATABASE_URLの取得
1. プロジェクトダッシュボードで「Connection Details」セクションを確認
2. 「Connection string」をコピー
3. 形式: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
4. **重要**: この接続文字列を安全な場所に保存（後で使用します）

---

### ステップ2: Render.com アカウントの作成

#### 2.1 Renderアカウントの作成
1. https://render.com/ にアクセス
2. 「Get Started」をクリック
3. GitHubアカウントでサインアップ（推奨）

---

### ステップ3: Web Service の作成

#### 3.1 GitHubリポジトリの連携
1. Renderダッシュボードで「New +」→「Web Service」をクリック
2. 「Connect a repository」でGitHubを選択
3. リポジトリへのアクセスを許可
4. **リポジトリを選択**: `Noe001/MallCount`

#### 3.2 Web Serviceの設定

**Basic Settings:**
- **Name**: `aeon-mall-tracker`（または任意の名前）
- **Region**: `Singapore`（日本に近いリージョン）
- **Branch**: `main`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build && npm run db:push
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Instance Type:**
- **Free**を選択

#### 3.3 render.yamlの使用（推奨）

Renderは自動的にリポジトリ内の`render.yaml`を検出します。
「Use render.yaml」オプションが表示された場合は、それを選択してください。
これにより、上記の設定が自動的に適用されます。

---

### ステップ4: 環境変数の設定

「Advanced」セクションまたは「Environment」タブで以下の環境変数を追加します：

#### 4.1 DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: ステップ1.3で取得したNeonの接続文字列
- 例: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

#### 4.2 SESSION_SECRET
- **Key**: `SESSION_SECRET`
- **Value**: 強力なランダム文字列
- **生成方法（オプション1）**: Renderの「Generate Value」ボタンを使用
- **生成方法（オプション2）**: ローカルで以下のコマンドを実行：
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### 4.3 NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

**注意**: `PORT`は設定不要です（Renderが自動的に設定します）

---

### ステップ5: デプロイの実行

#### 5.1 デプロイの開始
1. 「Create Web Service」をクリック
2. Renderが自動的にビルドとデプロイを開始します

#### 5.2 ビルドログの確認
1. 「Logs」タブでビルドの進行状況を確認
2. 以下のステップが正常に実行されることを確認：
   - `npm install` - 依存関係のインストール
   - `npm run build` - アプリケーションのビルド
   - `npm run db:push` - データベーススキーマの作成
   - `npm start` - アプリケーションの起動

#### 5.3 デプロイ完了の確認
1. ビルドが完了すると、ステータスが「Live」になります
2. 提供されたURLをコピー（例: `https://aeon-mall-tracker.onrender.com`）
3. **初回アクセス時は起動に30秒〜1分かかる場合があります**

---

### ステップ6: 動作確認

#### 6.1 Webブラウザでのアクセス
1. 提供されたURLにアクセス
2. ユーザー登録ページが表示されることを確認

#### 6.2 ユーザー登録とログイン
1. 新しいアカウントを作成
2. ログイン
3. モール一覧が表示されることを確認

#### 6.3 機能テスト
1. モール一覧の表示確認
2. 訪問記録の追加
3. 訪問記録の削除
4. データの永続性確認（ログアウト→ログイン後もデータが保持されているか）

#### 6.4 モバイルブラウザでのテスト
1. スマートフォンのブラウザでURLにアクセス
2. レスポンシブデザインの確認
3. タッチ操作の確認

---

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合

**確認事項:**
1. GitHubリポジトリに最新のコードがプッシュされているか
2. `package.json`の`build`スクリプトが正しいか
3. ログでエラーメッセージを確認

**解決方法:**
- Renderダッシュボードで「Manual Deploy」→「Clear build cache & deploy」を試す

### データベース接続エラー

**症状**: `Error: connect ECONNREFUSED`または`database connection failed`

**確認事項:**
1. `DATABASE_URL`が正しく設定されているか
2. 接続文字列に`?sslmode=require`が含まれているか
3. Neonデータベースがアクティブか

**解決方法:**
- Neonダッシュボードで接続文字列を再確認
- 環境変数を再設定後、サービスを再起動

### セッションが保持されない

**症状**: ログイン後すぐにログアウトされる

**確認事項:**
1. `SESSION_SECRET`が設定されているか
2. `NODE_ENV=production`が設定されているか

**解決方法:**
- 環境変数を確認し、必要に応じて再設定
- サービスを再起動

### 初回アクセスが遅い

**これは正常な動作です:**
- Renderの無料プランでは15分間非アクティブ時にスリープします
- 初回アクセス時は30秒〜1分待ってください
- アクティブになった後は通常速度で動作します

---

## 📊 無料プランの制限事項

### Neon Database
- **ストレージ**: 0.5GB
- **アクティブ時間**: 月間100時間（1日約3.3時間）
- **自動スリープ**: 非アクティブ時に自動スリープ

### Render.com
- **メモリ**: 512MB
- **スリープ**: 15分間非アクティブ時に自動スリープ
- **起動時間**: スリープからの復帰に30秒〜1分
- **稼働時間**: 月間750時間

---

## 📚 参考リソース

- **詳細なデプロイメントガイド**: `DEPLOYMENT.md`を参照
- **Neon Documentation**: https://neon.tech/docs
- **Render Documentation**: https://render.com/docs

---

## ✅ チェックリスト

デプロイ完了前に以下を確認してください：

- [ ] Neonアカウントの作成完了
- [ ] Neonプロジェクトの作成完了
- [ ] DATABASE_URLの取得完了
- [ ] Renderアカウントの作成完了
- [ ] GitHubリポジトリの連携完了
- [ ] Web Serviceの作成完了
- [ ] 環境変数の設定完了（DATABASE_URL、SESSION_SECRET、NODE_ENV）
- [ ] デプロイの実行完了
- [ ] ビルドログの確認完了
- [ ] Webブラウザでのアクセス確認完了
- [ ] ユーザー登録とログインの動作確認完了
- [ ] モール一覧の表示確認完了
- [ ] 訪問記録の追加・削除の動作確認完了
- [ ] モバイルブラウザでの動作確認完了

---

## 🎉 デプロイ完了後

デプロイが完了したら、以下のタスクに進むことができます：

- **タスク9**: 本番環境での動作確認（Playwright MCPサーバーを使用）
- **タスク10**: ドキュメントの最終確認

継続的なデプロイ: GitHubにコードをプッシュすると、Renderが自動的にビルドとデプロイを実行します。
