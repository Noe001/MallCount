import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = 'name' | 'visits' | 'date';

interface SortFilterProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" data-testid="select-sort">
          <SelectValue placeholder="並び替え" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name" data-testid="sort-option-name">名前順</SelectItem>
          <SelectItem value="visits" data-testid="sort-option-visits">訪問回数順</SelectItem>
          <SelectItem value="date" data-testid="sort-option-date">開業日順</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
