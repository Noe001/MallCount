import { useState } from 'react';
import SortFilter, { SortOption } from '../SortFilter';

export default function SortFilterExample() {
  const [sort, setSort] = useState<SortOption>('name');

  return (
    <SortFilter value={sort} onChange={setSort} />
  );
}
