import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RegionTabsProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

const REGIONS = [
  { id: 'all', label: '全国' },
  { id: 'hokkaido', label: '北海道' },
  { id: 'tohoku', label: '東北' },
  { id: 'kanto', label: '関東' },
  { id: 'chubu', label: '中部' },
  { id: 'kinki', label: '近畿' },
  { id: 'chugoku', label: '中国' },
  { id: 'shikoku', label: '四国' },
  { id: 'kyushu', label: '九州' },
];

export default function RegionTabs({ selectedRegion, onSelectRegion }: RegionTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        {REGIONS.map((region) => (
          <Button
            key={region.id}
            variant={selectedRegion === region.id ? "default" : "ghost"}
            onClick={() => onSelectRegion(region.id)}
            className="shrink-0"
            data-testid={`button-region-${region.id}`}
          >
            {region.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
