import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

interface AppHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  userName: string;
  userEmail?: string;
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function AppHeader({
  searchValue,
  onSearchChange,
  userName,
  userEmail,
  onSettings,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center shrink-0">
          <div>
            <h1 className="text-lg font-semibold leading-tight" data-testid="text-app-title">
              イオンモール訪問カウンター
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-2xl hidden md:block">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>

        <div className="shrink-0">
          <UserMenu
            userName={userName}
            userEmail={userEmail}
            onSettings={onSettings}
            onLogout={onLogout}
          />
        </div>
      </div>

      <div className="container px-4 pb-4 md:hidden">
        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
