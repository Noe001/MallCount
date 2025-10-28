import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import StatsDashboard from "@/components/StatsDashboard";
import RegionTabs from "@/components/RegionTabs";
import SortFilter, { SortOption } from "@/components/SortFilter";
import MallCard from "@/components/MallCard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useMalls, useVisits } from "@/hooks/useVisits";
import type { Mall, Visit } from "@shared/schema";

// 地方と都道府県のマッピング
const regionMapping: Record<string, string[]> = {
  hokkaido: ["北海道"],
  tohoku: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  kanto: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  chubu: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  kinki: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  chugoku: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  shikoku: ["徳島県", "香川県", "愛媛県", "高知県"],
  kyushu: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
};

export default function Home() {
  const [, setLocation] = useLocation();
  
  // Use real authentication
  const { user, isLoading: isLoadingAuth, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  
  // Use real data from API
  const { malls, isLoading: isLoadingMalls } = useMalls();
  const { 
    visits, 
    visitCountMap, 
    isLoadingVisits, 
    incrementVisit, 
    decrementVisit,
    isIncrementing,
    isDecrementing
  } = useVisits();

  const handleIncrement = (mallId: number) => {
    incrementVisit(mallId);
  };

  const handleDecrement = (mallId: number) => {
    decrementVisit(mallId);
  };

  const handleLogout = () => {
    logout();
  };

  const filteredAndSortedMalls = useMemo(() => {
    let filtered = malls;

    // Filter by region
    if (selectedRegion !== "all") {
      const prefectures = regionMapping[selectedRegion];
      if (prefectures) {
        filtered = filtered.filter(mall => prefectures.includes(mall.prefecture));
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mall =>
        mall.name.toLowerCase().includes(query) ||
        mall.prefecture.toLowerCase().includes(query) ||
        mall.address.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, 'ja');
        case "visits":
          return (visitCountMap[b.id] || 0) - (visitCountMap[a.id] || 0);
        case "date":
          return new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [malls, selectedRegion, searchQuery, sortBy, visitCountMap]);

  // Calculate stats
  const totalVisits = visits.reduce((sum, visit) => sum + visit.visitCount, 0);
  const uniqueMalls = visits.filter(v => v.visitCount > 0).length;
  
  const mostVisitedVisit = visits.reduce((max, visit) => 
    visit.visitCount > (max?.visitCount || 0) ? visit : max, 
    visits[0]
  );
  const mostVisitedMall = mostVisitedVisit 
    ? malls.find(m => m.id === mostVisitedVisit.mallId)?.name.replace('イオンモール', '') || '-'
    : '-';
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthVisits = visits.filter(visit => {
    if (!visit.lastVisitedAt) return false;
    const visitDate = new Date(visit.lastVisitedAt);
    return visitDate.getMonth() === thisMonth && visitDate.getFullYear() === thisYear;
  }).length;

  // Format last visit date for display
  const getLastVisitDisplay = (mallId: number): string | undefined => {
    const visit = visits.find(v => v.mallId === mallId);
    if (!visit?.lastVisitedAt) return undefined;
    
    const date = new Date(visit.lastVisitedAt);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // Show loading state
  const isLoading = isLoadingAuth || isLoadingMalls || isLoadingVisits;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground" data-testid="text-loading">
            読み込み中...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthModal
        open={!isAuthenticated}
        onOpenChange={(open) => !open && setLocation('/')}
        onLogin={() => setLocation('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        userName={user?.firstName && user?.lastName ? `${user.lastName} ${user.firstName}` : user?.email || "ユーザー"}
        userEmail={user?.email || ""}
        onSettings={() => setLocation('/settings')}
        onLogout={handleLogout}
      />

      <StatsDashboard
        totalVisits={totalVisits}
        uniqueMalls={uniqueMalls}
        mostVisitedMall={mostVisitedMall}
        thisMonthVisits={thisMonthVisits}
      />

      <div className="container pb-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <RegionTabs
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
            <SortFilter value={sortBy} onChange={setSortBy} />
          </div>

          {filteredAndSortedMalls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-results">
                該当するモールが見つかりませんでした
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" data-testid="grid-malls">
              {filteredAndSortedMalls.map((mall) => (
                <MallCard
                  key={mall.id}
                  id={mall.id}
                  name={mall.name}
                  prefecture={mall.prefecture}
                  address={mall.address}
                  openingDate={mall.displayDate}
                  visitCount={visitCountMap[mall.id] || 0}
                  lastVisit={getLastVisitDisplay(mall.id)}
                  onIncrement={() => handleIncrement(mall.id)}
                  onDecrement={() => handleDecrement(mall.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onLogin={() => setShowAuthModal(false)}
      />
    </div>
  );
}
