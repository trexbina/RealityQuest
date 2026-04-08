'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

export function PreRegistrationForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin 
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get('content-type');
      
      if (!res.ok) {
        let errorMessage = `Failed to ${isLogin ? 'login' : 'register'}`;
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } else {
          const text = await res.text();
          console.error(`Status ${res.status}: Server returned HTML instead of JSON: ${text.substring(0, 200)}...`);
          errorMessage = `Server Error (${res.status}): Please check if the dev server is running.`;
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        await res.json();
        setSuccess(true);
        // We will reload the window to refresh auth state everywhere
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-black/60 backdrop-blur-xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          {isLogin ? 'Access System' : 'Join the Faction'}
        </CardTitle>
        <CardDescription>
          {isLogin ? 'Enter your credentials to continue.' : 'Create an account to begin your journey.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-semibold tracking-wide text-xs uppercase">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="strife@midgar.com" 
                  required={!isLogin}
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 bg-black/50 border-border focus:border-primary/50 transition-all font-mono"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300 font-semibold tracking-wide text-xs uppercase">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="username" 
                name="username" 
                type="text" 
                placeholder="CloudStrife99" 
                required 
                value={formData.username}
                onChange={handleChange}
                className="pl-9 bg-black/50 border-border focus:border-primary/50 transition-all font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 font-semibold tracking-wide text-xs uppercase">Secure Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="pl-9 bg-black/50 border-border focus:border-primary/50 transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm font-medium">
              {error}
            </div>
          )}

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-xs text-primary/80 hover:text-primary font-mono uppercase tracking-widest underline decoration-primary/50 underline-offset-4 transition-colors"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-black hover:bg-primary/90 btn-glow font-bold tracking-widest uppercase transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLogin ? 'Login' : 'Register Now'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
