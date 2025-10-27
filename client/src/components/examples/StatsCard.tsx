import StatsCard from '../StatsCard';
import { TrendingUp } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="max-w-xs">
      <StatsCard
        icon={TrendingUp}
        value={42}
        label="総訪問回数"
      />
    </div>
  );
}
