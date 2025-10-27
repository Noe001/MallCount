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
      return await apiRequest("/api/visits/increment", "POST", { mallId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
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
        description: "訪問記録の追加に失敗しました",
        variant: "destructive",
      });
    },
  });

  const decrementMutation = useMutation({
    mutationFn: async (mallId: number) => {
      return await apiRequest("/api/visits/decrement", "POST", { mallId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
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
        description: "訪問記録の削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/visits/reset", "DELETE");
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
