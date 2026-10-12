'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout} loading={loading}>
      Вийти
    </Button>
  );
}
