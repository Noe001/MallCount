import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft, Moon, Sun, Monitor, Trash2, Bell, Database } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleResetData = () => {
    console.log("Resetting all data...");
    localStorage.clear();
    window.location.reload();
  };

  const getThemeIcon = (currentTheme: string) => {
    switch (currentTheme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold" data-testid="text-settings-title">
            設定
          </h1>
        </div>
      </header>

      <div className="container max-w-2xl px-4 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="p-6" data-testid="card-appearance">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">外観</h2>
                <p className="text-sm text-muted-foreground">
                  アプリの表示テーマを選択
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme-select">テーマ</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                  <SelectTrigger id="theme-select" className="w-full" data-testid="select-theme">
                    <div className="flex items-center gap-2">
                      {getThemeIcon(theme)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" data-testid="theme-light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <span>ライト</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark" data-testid="theme-dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        <span>ダーク</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system" data-testid="theme-system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        <span>システム設定に従う</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-notifications">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">通知</h2>
                <p className="text-sm text-muted-foreground">
                  通知の設定を管理
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications" className="text-base">
                      通知を有効化
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      訪問記録のリマインダーを受け取る
                    </p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  data-testid="switch-notifications"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-data">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">データ管理</h2>
                <p className="text-sm text-muted-foreground">
                  データの同期とバックアップ
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="auto-sync" className="text-base">
                      自動同期
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      データを自動的に同期する
                    </p>
                  </div>
                </div>
                <Switch
                  id="auto-sync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                  data-testid="switch-auto-sync"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-destructive/50" data-testid="card-danger">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1 text-destructive">
                  危険な操作
                </h2>
                <p className="text-sm text-muted-foreground">
                  この操作は元に戻せません
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" data-testid="button-reset-data">
                    <Trash2 className="w-4 h-4 mr-2" />
                    すべてのデータをリセット
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>本当にリセットしますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作により、すべての訪問記録が削除されます。
                      この操作は元に戻すことができません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-cancel-reset">
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-testid="button-confirm-reset"
                    >
                      リセットする
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>

          <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>イオンモール訪問カウンター v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
