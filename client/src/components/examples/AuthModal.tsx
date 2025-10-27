import { useState } from 'react';
import AuthModal from '../AuthModal';
import { Button } from '@/components/ui/button';

export default function AuthModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        認証モーダルを開く
      </Button>
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        onLogin={(email, password) => {
          console.log('Login:', email, password);
          setOpen(false);
        }}
      />
    </div>
  );
}
