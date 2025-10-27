import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar } from "lucide-react";

interface MallCardProps {
  id: number;
  name: string;
  prefecture: string;
  address: string;
  openingDate: string;
  visitCount: number;
  lastVisit?: string;
  onIncrement: () => void;
}

export default function MallCard({
  name,
  prefecture,
  address,
  openingDate,
  visitCount,
  lastVisit,
  onIncrement,
}: MallCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200" data-testid={`card-mall-${name}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-medium leading-tight flex-1" data-testid={`text-mall-name-${name}`}>
          {name}
        </h3>
        <Badge variant="secondary" className="text-xs px-2 py-1 shrink-0" data-testid={`badge-prefecture-${prefecture}`}>
          {prefecture}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1" data-testid={`text-address-${name}`}>{address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4 shrink-0" />
          <span data-testid={`text-opening-date-${name}`}>開業: {openingDate}</span>
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <div className="text-center">
          <div className="text-4xl font-bold font-inter" data-testid={`text-visit-count-${name}`}>{visitCount}</div>
          <div className="text-xs text-muted-foreground mt-1">訪問回数</div>
        </div>
        
        <Button
          onClick={onIncrement}
          className="w-full py-3"
          data-testid={`button-increment-${name}`}
        >
          <Plus className="w-5 h-5 mr-2" />
          訪問を記録
        </Button>
        
        {lastVisit && (
          <div className="text-center text-xs text-muted-foreground" data-testid={`text-last-visit-${name}`}>
            最終訪問: {lastVisit}
          </div>
        )}
      </div>
    </Card>
  );
}
