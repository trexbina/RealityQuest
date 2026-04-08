'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Check if there's a saved theme
    const savedTheme = localStorage.getItem('realityquest-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('realityquest-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => changeTheme('default')}
        className={`h-7 px-3 text-[10px] font-mono tracking-widest uppercase transition-colors ${theme === 'default' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
      >
        Cyber
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => changeTheme('blue')}
        className={`h-7 px-3 text-[10px] font-mono tracking-widest uppercase transition-colors ${theme === 'blue' ? 'border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/10' : 'border-border text-muted-foreground'}`}
      >
        Blue
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => changeTheme('red')}
        className={`h-7 px-3 text-[10px] font-mono tracking-widest uppercase transition-colors ${theme === 'red' ? 'border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10' : 'border-border text-muted-foreground'}`}
      >
        Red
      </Button>
    </div>
  );
}
