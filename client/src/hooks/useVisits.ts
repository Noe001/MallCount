import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Visit, Mall } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useVisits() {
  const { toast } = useToast();

  const { data: visits = [], isLoading: isLoadingVisits } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const incrementMutation = useMutation({
    mutationFn: async (mallId: number) => {
      return await apiRequest("POST", "/api/visits/increment", { mallId });
    },
    onMutate: async (mallId: number) => {
      // 保存中トーストを表示
      toast({
        title: "保存中...",
        description: "訪問記録を保存しています",
        duration: 1000,
      });

      // キャンセル進行中のクエリ
      await queryClient.cancelQueries({ queryKey: ["/api/visits"] });

      // 以前のデータを取得
      const previousVisits = queryClient.getQueryData<Visit[]>(["/api/visits"]);

      // 楽観的更新
      if (previousVisits) {
        const existingVisit = previousVisits.find(v => v.mallId === mallId);
        if (existingVisit) {
          // 既存の訪問記録を更新
          queryClient.setQueryData<Visit[]>(["/api/visits"],
            previousVisits.map(v =>
              v.mallId === mallId
                ? { ...v, visitCount: v.visitCount + 1, lastVisitedAt: new Date() }
                : v
            )
          );
        } else {
          // 新しい訪問記録を追加
          queryClient.setQueryData<Visit[]>(["/api/visits"], [
            ...previousVisits,
            {
              id: Date.now(), // 一時的なID
              mallId,
              userId: '', // 一時的な値
              visitCount: 1,
              lastVisitedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]);
        }
      }

      return { previousVisits };
    },
    onSuccess: () => {
      // サーバーから最新データを取得
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
    },
    onError: (error: Error, _mallId, context) => {
      // エラー時は以前のデータに戻す
      if (context?.previousVisits) {
        queryClient.setQueryData(["/api/visits"], context.previousVisits);
      }

      if (isUnauthorizedError(error)) {
        toast({
          title: "未認証",
          description: "ログインし直しています...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "エラー",
        description: "訪問記録の追加に失敗しました",
        variant: "destructive",
      });
    },
  });

  const decrementMutation = useMutation({
    mutationFn: async (mallId: number) => {
      return await apiRequest("POST", "/api/visits/decrement", { mallId });
    },
    onMutate: async (mallId: number) => {
      // 保存中トーストを表示
      toast({
        title: "保存中...",
        description: "訪問記録を保存しています",
        duration: 1000,
      });

      // キャンセル進行中のクエリ
      await queryClient.cancelQueries({ queryKey: ["/api/visits"] });

      // 以前のデータを取得
      const previousVisits = queryClient.getQueryData<Visit[]>(["/api/visits"]);

      // 楽観的更新
      if (previousVisits) {
        queryClient.setQueryData<Visit[]>(["/api/visits"],
          previousVisits.map(v =>
            v.mallId === mallId && v.visitCount > 0
              ? { ...v, visitCount: v.visitCount - 1, lastVisitedAt: new Date() }
              : v
          ).filter(v => v.visitCount > 0) // カウントが0になったら削除
        );
      }

      return { previousVisits };
    },
    onSuccess: () => {
      // サーバーから最新データを取得
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
    },
    onError: (error: Error, _mallId, context) => {
      // エラー時は以前のデータに戻す
      if (context?.previousVisits) {
        queryClient.setQueryData(["/api/visits"], context.previousVisits);
      }

      if (isUnauthorizedError(error)) {
        toast({
          title: "未認証",
          description: "ログインし直しています...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "エラー",
        description: "訪問記録の削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/visits/reset");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
      toast({
        title: "成功",
        description: "すべての訪問記録をリセットしました",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "未認証",
          description: "ログインし直しています...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "エラー",
        description: "リセットに失敗しました",
        variant: "destructive",
      });
    },
  });

  // Create a map of mallId to visit count for easy lookup
  const visitCountMap = visits.reduce((acc, visit) => {
    acc[visit.mallId] = visit.visitCount;
    return acc;
  }, {} as Record<number, number>);

  return {
    visits,
    visitCountMap,
    isLoadingVisits,
    incrementVisit: incrementMutation.mutate,
    decrementVisit: decrementMutation.mutate,
    resetAllVisits: resetMutation.mutate,
    isIncrementing: incrementMutation.isPending,
    isDecrementing: decrementMutation.isPending,
    isResetting: resetMutation.isPending,
  };
}

export function useMalls() {
  const { data: malls = [], isLoading } = useQuery<Mall[]>({
    queryKey: ["/api/malls"],
  });

  return {
    malls,
    isLoading,
  };
}
