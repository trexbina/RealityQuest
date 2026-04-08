'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Clock, User, PlusCircle, Loader2, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AlertBanner } from '@/components/thegridcn/alert-banner';
import { DataCard } from '@/components/thegridcn/data-card';

type Thread = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export function CommunityHub() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      const contentType = res.headers.get('content-type');
      
      if (!res.ok) {
        const text = await res.text();
        console.error(`Status ${res.status}: ${text.substring(0, 100)}...`);
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setThreads(data);
      } else {
        const text = await res.text();
        console.error('Expected JSON but received:', text.substring(0, 100));
      }
    } catch (error) {
      console.error('Failed to fetch threads', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchThreads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert('Must be logged in!');
    setSubmitting(true);
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type');
      
      if (!res.ok) {
        let errorMessage = 'Failed to post thread';
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } else {
          errorMessage = `Server Error: Received HTML instead of JSON.`;
        }
        throw new Error(errorMessage);
      }

      if (res.ok) {
        setFormData({ title: '', content: '' });
        setIsCreating(false);
        fetchThreads(); // Refresh the list
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Obliterate this missive from the Grid?')) return;
    try {
      const res = await fetch(`/api/threads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchThreads();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <AlertBanner 
          title="Adventurer's Tavern"
          subtitle={currentUser ? `SECURE CHANNEL: ${currentUser.role}` : "PUBLIC CHANNEL"}
          variant={currentUser?.role === 'ADMIN' ? 'danger' : 'info'}
          className="w-full sm:w-auto min-w-[300px]"
        />
        
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="text-xs font-mono text-primary mr-2 uppercase">
                Welcome, {currentUser.username}
              </div>
              <Button 
                onClick={() => setIsCreating(!isCreating)}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/20 transition-all font-mono uppercase tracking-widest text-xs btn-glow"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {isCreating ? 'Cancel Draft' : 'Create Missive'}
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/20 transition-all font-mono uppercase tracking-widest text-xs"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="text-xs font-mono text-muted-foreground uppercase">
              Login Required to Post
            </div>
          )}
        </div>
      </div>

      {isCreating && currentUser && (
        <Card className="mb-8 border-primary/40 bg-black/50 backdrop-blur-sm glow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Draft New Missive</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g. LFG Downtown Raid" 
                  className="bg-black/40 border-border/50 text-white font-mono max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label>Message content</Label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[120px] rounded-md border border-border/50 bg-black/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 text-white font-mono"
                  placeholder="Share your thoughts..."
                />
              </div>
              <Button type="submit" disabled={submitting} className="btn-glow bg-primary text-black font-bold uppercase tracking-widest text-xs">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Post Thread
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <Card className="border-dashed border-muted bg-transparent">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">The tavern is empty. Be the first to start a conversation!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {threads.map((thread) => (
            <DataCard
              key={thread.id}
              title={thread.title}
              subtitle="PUBLIC COMMS"
              fields={[
                { label: "AUTHOR", value: thread.authorName, highlight: true },
                { label: "TIME", value: formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }) },
              ]}
              className="group hover:border-primary/80 transition-colors"
            >
              <div className="px-4 pb-4">
                <div className="p-3 bg-black/30 border border-border/30 rounded font-mono text-sm text-gray-300 leading-relaxed mb-3">
                  {thread.content}
                </div>
                
                {currentUser && (currentUser.id === thread.authorId || currentUser.role === 'ADMIN') && (
                  <div className="flex justify-end gap-2 border-t border-border/20 pt-3 mt-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 uppercase tracking-widest h-7" 
                      onClick={() => handleDelete(thread.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}
