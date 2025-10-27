import UserMenu from '../UserMenu';

export default function UserMenuExample() {
  return (
    <UserMenu
      userName="山田太郎"
      userEmail="yamada@example.com"
      onProfile={() => console.log('Profile clicked')}
      onSettings={() => console.log('Settings clicked')}
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
