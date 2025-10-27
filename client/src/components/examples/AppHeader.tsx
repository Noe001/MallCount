import { useState } from 'react';
import AppHeader from '../AppHeader';

export default function AppHeaderExample() {
  const [search, setSearch] = useState('');

  return (
    <AppHeader
      searchValue={search}
      onSearchChange={setSearch}
      userName="山田太郎"
      userEmail="yamada@example.com"
      onSettings={() => console.log('Settings')}
      onLogout={() => console.log('Logout')}
    />
  );
}
