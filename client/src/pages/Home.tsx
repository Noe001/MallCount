import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import StatsDashboard from "@/components/StatsDashboard";
import RegionTabs from "@/components/RegionTabs";
import SortFilter, { SortOption } from "@/components/SortFilter";
import MallCard from "@/components/MallCard";
import AuthModal from "@/components/AuthModal";

// TODO: Remove mock data - replace with real data from API
const MOCK_MALLS = [
  { id: 1, name: "イオンモール幕張新都心", prefecture: "千葉県", region: "kanto", address: "千葉県千葉市美浜区豊砂1-1", openingDate: "2013-12-20", displayDate: "2013年12月20日" },
  { id: 2, name: "イオンモール札幌発寒", prefecture: "北海道", region: "hokkaido", address: "北海道札幌市西区発寒8条12-1", openingDate: "2015-03-27", displayDate: "2015年3月27日" },
  { id: 3, name: "イオンモール名古屋茶屋", prefecture: "愛知県", region: "chubu", address: "愛知県名古屋市港区西茶屋2-11", openingDate: "2021-10-27", displayDate: "2021年10月27日" },
  { id: 4, name: "イオンモール大阪ドームシティ", prefecture: "大阪府", region: "kinki", address: "大阪府大阪市西区千代崎3-13-1", openingDate: "2013-03-15", displayDate: "2013年3月15日" },
  { id: 5, name: "イオンモール福岡", prefecture: "福岡県", region: "kyushu", address: "福岡県糟屋郡粕屋町大字酒殿字老ノ木192-1", openingDate: "2004-06-04", displayDate: "2004年6月4日" },
  { id: 6, name: "イオンモール岡山", prefecture: "岡山県", region: "chugoku", address: "岡山県岡山市北区下石井1-2-1", openingDate: "2014-12-05", displayDate: "2014年12月5日" },
  { id: 7, name: "イオンモール仙台", prefecture: "宮城県", region: "tohoku", address: "宮城県仙台市青葉区中央2-3-6", openingDate: "2011-03-17", displayDate: "2011年3月17日" },
  { id: 8, name: "イオンモール高松", prefecture: "香川県", region: "shikoku", address: "香川県高松市香西本町1-1", openingDate: "2001-11-03", displayDate: "2001年11月3日" },
  { id: 9, name: "イオンモール木曽川", prefecture: "愛知県", region: "chubu", address: "愛知県一宮市木曽川町黒田字南八ツケ池25-1", openingDate: "1999-09-09", displayDate: "1999年9月9日" },
  { id: 10, name: "イオンモール日の出", prefecture: "東京都", region: "kanto", address: "東京都西多摩郡日の出町大字平井237-3", openingDate: "2007-11-23", displayDate: "2007年11月23日" },
  { id: 11, name: "イオンモール京都", prefecture: "京都府", region: "kinki", address: "京都府京都市南区西九条鳥居口町1", openingDate: "2010-06-04", displayDate: "2010年6月4日" },
  { id: 12, name: "イオンモール広島府中", prefecture: "広島県", region: "chugoku", address: "広島県安芸郡府中町大須2-1-1", openingDate: "2004-04-01", displayDate: "2004年4月1日" },
  { id: 13, name: "イオンモール神戸北", prefecture: "兵庫県", region: "kinki", address: "兵庫県神戸市北区上津台8-1-1", openingDate: "2006-11-18", displayDate: "2006年11月18日" },
  { id: 14, name: "イオンモール橿原", prefecture: "奈良県", region: "kinki", address: "奈良県橿原市曲川町7-20-1", openingDate: "2004-04-01", displayDate: "2004年4月1日" },
  { id: 15, name: "イオンモール新潟南", prefecture: "新潟県", region: "chubu", address: "新潟県新潟市江南区下早通柳田1-1-1", openingDate: "2007-05-03", displayDate: "2007年5月3日" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  
  // TODO: Remove mock authentication - replace with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  
  // TODO: Remove mock visit counts - replace with real data from database
  const [visitCounts, setVisitCounts] = useState<Record<number, number>>({
    1: 5,
    2: 3,
    4: 8,
    6: 2,
    10: 1,
  });

  // TODO: Remove mock last visit dates - replace with real data
  const [lastVisits, setLastVisits] = useState<Record<number, string>>({
    1: "2024年10月15日",
    2: "2024年09月20日",
    4: "2024年10月25日",
  });

  const handleIncrement = (mallId: number) => {
    console.log(`Incrementing visit count for mall ${mallId}`);
    setVisitCounts(prev => ({
      ...prev,
      [mallId]: (prev[mallId] || 0) + 1
    }));
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    setLastVisits(prev => ({
      ...prev,
      [mallId]: dateStr
    }));
  };

  const handleDecrement = (mallId: number) => {
    console.log(`Decrementing visit count for mall ${mallId}`);
    setVisitCounts(prev => {
      const currentCount = prev[mallId] || 0;
      if (currentCount > 0) {
        return {
          ...prev,
          [mallId]: currentCount - 1
        };
      }
      return prev;
    });
  };

  const filteredAndSortedMalls = useMemo(() => {
    let filtered = MOCK_MALLS;

    // Filter by region
    if (selectedRegion !== "all") {
      filtered = filtered.filter(mall => mall.region === selectedRegion);
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
          return (visitCounts[b.id] || 0) - (visitCounts[a.id] || 0);
        case "date":
          return new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [selectedRegion, searchQuery, sortBy, visitCounts]);

  // Calculate stats
  const totalVisits = Object.values(visitCounts).reduce((sum, count) => sum + count, 0);
  const uniqueMalls = Object.keys(visitCounts).length;
  const mostVisitedMallId = Object.entries(visitCounts).reduce((max, [id, count]) => 
    count > (visitCounts[max] || 0) ? parseInt(id) : max, 
    Object.keys(visitCounts)[0] ? parseInt(Object.keys(visitCounts)[0]) : 0
  );
  const mostVisitedMall = MOCK_MALLS.find(m => m.id === mostVisitedMallId)?.name.replace('イオンモール', '') || '-';
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthVisits = Object.entries(lastVisits).filter(([_, date]) => {
    const match = date.match(/(\d+)年(\d+)月/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      return year === thisYear && month === thisMonth;
    }
    return false;
  }).length;

  if (!isAuthenticated) {
    return (
      <AuthModal
        open={!isAuthenticated}
        onOpenChange={(open) => !open && setIsAuthenticated(true)}
        onLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        userName="山田太郎"
        userEmail="yamada@example.com"
        onSettings={() => setLocation('/settings')}
        onLogout={() => {
          console.log('Logout clicked');
          setIsAuthenticated(false);
        }}
      />

      <StatsDashboard
        totalVisits={totalVisits}
        uniqueMalls={uniqueMalls}
        mostVisitedMall={mostVisitedMall}
        thisMonthVisits={thisMonthVisits}
      />

      <div className="container px-4 lg:px-8 pb-12">
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
                  visitCount={visitCounts[mall.id] || 0}
                  lastVisit={lastVisits[mall.id]}
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
