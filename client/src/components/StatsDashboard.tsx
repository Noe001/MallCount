import StatsCard from "./StatsCard";

interface StatsDashboardProps {
  totalVisits: number;
  uniqueMalls: number;
  mostVisitedMall: string;
  thisMonthVisits: number;
}

export default function StatsDashboard({
  totalVisits,
  uniqueMalls,
  mostVisitedMall,
  thisMonthVisits,
}: StatsDashboardProps) {
  return (
    <div className="py-12" data-testid="section-stats">
      <div className="container">
        <h2 className="text-xl font-semibold mb-6" data-testid="text-stats-heading">
          訪問統計
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            value={totalVisits}
            label="総訪問回数"
            testId="card-total-visits"
          />
          <StatsCard
            value={uniqueMalls}
            label="訪問モール数"
            testId="card-unique-malls"
          />
          <StatsCard
            value={mostVisitedMall}
            label="最多訪問モール"
            testId="card-most-visited"
          />
          <StatsCard
            value={thisMonthVisits}
            label="今月の訪問"
            testId="card-month-visits"
          />
        </div>
      </div>
    </div>
  );
}
