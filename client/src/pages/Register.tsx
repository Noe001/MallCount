import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { queryClient } from "@/lib/queryClient";

export default function Register() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "登録に失敗しました");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("パスワードは8文字以上である必要があります");
      return;
    }

    registerMutation.mutate({
      email,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Store className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">アカウント作成</CardTitle>
          <CardDescription className="text-center">
            イオンモール訪問記録を管理
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={registerMutation.isPending}
                data-testid="input-email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">名</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="太郎"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={registerMutation.isPending}
                  data-testid="input-firstName"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">姓</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="山田"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={registerMutation.isPending}
                  data-testid="input-lastName"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={registerMutation.isPending}
                data-testid="input-password"
              />
              <p className="text-xs text-muted-foreground">
                8文字以上で入力してください
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード確認 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={registerMutation.isPending}
                data-testid="input-confirmPassword"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
              data-testid="button-submit"
            >
              {registerMutation.isPending ? "登録中..." : "アカウント作成"}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setLocation("/login")}
                className="text-primary hover:underline"
                data-testid="button-login"
              >
                すでにアカウントをお持ちの方
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
