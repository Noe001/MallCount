import { useState } from 'react';
import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full max-w-2xl">
      <SearchBar value={search} onChange={setSearch} />
    </div>
  );
}
