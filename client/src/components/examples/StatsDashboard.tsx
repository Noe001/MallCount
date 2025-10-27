import StatsDashboard from '../StatsDashboard';

export default function StatsDashboardExample() {
  return (
    <div className="bg-background">
      <StatsDashboard
        totalVisits={42}
        uniqueMalls={15}
        mostVisitedMall="幕張新都心"
        thisMonthVisits={8}
      />
    </div>
  );
}
