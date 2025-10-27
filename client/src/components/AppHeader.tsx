import { Store } from "lucide-react";
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
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold leading-tight" data-testid="text-app-title">
              イオンモール
            </h1>
            <p className="text-xs text-muted-foreground">訪問カウンター</p>
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
