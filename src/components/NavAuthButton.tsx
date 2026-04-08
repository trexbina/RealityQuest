'use client';

import { useState, useEffect } from 'react';

export function NavAuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (loading) return null;

  if (user) {
    return (
      <button 
        onClick={handleLogout}
        className="font-mono text-[10px] uppercase tracking-widest text-destructive border border-destructive/50 hover:bg-destructive/10 px-3 py-1.5 rounded transition-colors"
      >
        Logout
      </button>
    );
  }

  return (
    <a 
      href="#register" 
      className="font-mono text-[10px] uppercase tracking-widest text-primary border border-primary/50 hover:bg-primary/10 px-3 py-1.5 rounded transition-colors"
    >
      Login / Join
    </a>
  );
}
