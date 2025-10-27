import { useState } from 'react';
import RegionTabs from '../RegionTabs';

export default function RegionTabsExample() {
  const [selected, setSelected] = useState('all');

  return (
    <div className="w-full max-w-4xl">
      <RegionTabs selectedRegion={selected} onSelectRegion={setSelected} />
    </div>
  );
}
