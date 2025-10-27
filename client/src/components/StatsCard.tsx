import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  testId?: string;
}

export default function StatsCard({ icon: Icon, value, label, testId }: StatsCardProps) {
  return (
    <Card className="p-6 text-center" data-testid={testId || `card-stat-${label}`}>
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="text-3xl font-bold font-inter mb-1" data-testid={`text-stat-value-${label}`}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground" data-testid={`text-stat-label-${label}`}>
        {label}
      </div>
    </Card>
  );
}
