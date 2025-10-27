import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          イオンモール訪問カウンター
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          全国のイオンモールへの訪問記録を簡単に管理できます。
          訪問回数を記録して、お気に入りのモールを見つけましょう。
        </p>

        <div className="flex flex-col gap-4 items-center pt-8">
          <Button
            size="lg"
            onClick={handleLogin}
            className="text-lg px-8"
            data-testid="button-login"
          >
            ログイン / 新規登録
          </Button>
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでない方も、上記ボタンから新規登録できます
          </p>
        </div>

        <div className="pt-12 space-y-4">
          <h2 className="text-xl font-semibold">主な機能</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">訪問記録</h3>
              <p className="text-sm text-muted-foreground">
                各モールへの訪問回数を簡単に記録・管理
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">統計表示</h3>
              <p className="text-sm text-muted-foreground">
                総訪問回数や訪問したモールの数を確認
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">検索・フィルター</h3>
              <p className="text-sm text-muted-foreground">
                地域や名前で簡単にモールを検索
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
