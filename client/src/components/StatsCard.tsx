import { Card } from "@/components/ui/card";

interface StatsCardProps {
  value: string | number;
  label: string;
  testId?: string;
}

export default function StatsCard({ value, label, testId }: StatsCardProps) {
  return (
    <Card className="p-6 text-center" data-testid={testId || `card-stat-${label}`}>
      <div className="text-3xl font-bold font-inter mb-1" data-testid={`text-stat-value-${label}`}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground" data-testid={`text-stat-label-${label}`}>
        {label}
      </div>
    </Card>
  );
}
