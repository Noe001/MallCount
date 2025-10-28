import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("ログアウトに失敗しました");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      setLocation("/login");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: { firstName?: string; lastName?: string }) => {
      const response = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }

      return response.json();
    },
    onMutate: () => {
      toast({
        title: "保存中...",
        description: "プロフィールを更新しています",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "成功",
        description: "プロフィールを更新しました",
      });
    },
    onError: (error: Error) => {
      console.error("Update user error:", error);
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    updateUser: (updates: { firstName?: string; lastName?: string }) => updateUserMutation.mutate(updates),
    isUpdating: updateUserMutation.isPending,
  };
}
