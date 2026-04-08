'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, PlusCircle, Loader2, Trash2, Edit, ChevronUp, ChevronDown, Paperclip, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AlertBanner } from '@/components/thegridcn/alert-banner';
import { DataCard } from '@/components/thegridcn/data-card';

// Ensure this matches Prisma schema
type Thread = {
  id: string;
  title: string;
  content: string;
  mediaData?: string | null;
  mediaType?: string | null;
  upvotedByIds: string[];
  downvotedByIds: string[];
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
  const [fileLimitWarning, setFileLimitWarning] = useState(false);
  
  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({ title: '', content: '', mediaData: '', mediaType: '' });

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
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

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) { // 20 MB client limit
      alert('File exceeds 20MB client limit.');
      e.target.value = '';
      return;
    }
    
    // Show Vercel warning limit just once if a file is over 4.5MB
    if (file.size > 4.5 * 1024 * 1024 && !fileLimitWarning) {
      alert('WARNING: Files over 4.5MB may be blocked by Vercel serverless request limits if deployed online. Local dev will work normally.');
      setFileLimitWarning(true);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string; 
      setFormData(prev => ({ 
        ...prev, 
        mediaData: result, 
        mediaType: file.type 
      }));
    };
    reader.readAsDataURL(file);
  };

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

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || `Request rejected (likely payload too large for server config)`);
      }

      setFormData({ title: '', content: '', mediaData: '', mediaType: '' });
      setIsCreating(false);
      fetchThreads(); 
    } catch (error: any) {
      console.error(error);
      alert(error.message);
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
        alert('Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Editing methods
  const startEdit = (thread: Thread) => {
    setEditingId(thread.id);
    setEditFormData({ title: thread.title, content: thread.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = async (id: string) => {
    try {
      const res = await fetch(`/api/threads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setEditingId(null);
        fetchThreads();
      } else {
        alert('Failed to update thread');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Voting Methods
  const handleVote = async (id: string, type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!currentUser) return alert('Must login to vote.');
    
    // Optimistic UI Update (optional, sticking to fetch refresh for accuracy)
    try {
      await fetch(`/api/threads/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      fetchThreads();
    } catch(e) {
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
              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer w-fit">
                  <Paperclip className="w-4 h-4" /> Optional Attachment (Max 20MB Local / 4.5MB Vercel)
                </Label>
                <Input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="bg-black/40 border-border/50 text-white font-mono max-w-md file:bg-primary file:text-black file:font-semibold file:uppercase tracking-widest file:border-0 hover:file:bg-primary/90"
                />
                {formData.mediaData && (
                  <div className="text-xs text-primary font-mono mt-1">Attachment queued securely.</div>
                )}
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
          {threads.map((thread) => {
            const isEditing = editingId === thread.id;
            const isExpanded = expandedIds.has(thread.id);
            const TRUNCATE_LENGTH = 200;
            const shouldTruncate = thread.content.length > TRUNCATE_LENGTH;
            const displayContent = shouldTruncate && !isExpanded 
              ? thread.content.slice(0, TRUNCATE_LENGTH) + '...' 
              : thread.content;

            if (isEditing) {
              return (
                <Card key={thread.id} className="border-primary/40 bg-black/50 backdrop-blur-sm glow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Editing Missive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          value={editFormData.title} 
                          onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} 
                          className="bg-black/40 border-border/50 text-white font-mono max-w-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message content</Label>
                        <textarea 
                          value={editFormData.content}
                          onChange={e => setEditFormData({ ...editFormData, content: e.target.value })}
                          className="w-full min-h-[120px] rounded-md border border-border/50 bg-black/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 text-white font-mono"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleEditSubmit(thread.id)} className="btn-glow bg-primary text-black font-bold uppercase tracking-widest text-xs">
                          <Check className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                        <Button variant="outline" onClick={cancelEdit} className="uppercase tracking-widest text-xs text-white border-white/20 hover:bg-white/10">
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <DataCard
                key={thread.id}
                title={thread.title}
                subtitle="PUBLIC COMMS"
                fields={[
                  { label: "AUTHOR", value: thread.authorName, highlight: true },
                  { label: "TIME", value: formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }) },
                ]}
                action={
                  currentUser && (currentUser.id === thread.authorId || currentUser.role === 'ADMIN') ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEdit(thread)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Edit Missive"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(thread.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        title="Delete Missive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : undefined
                }
                className="group hover:border-primary/80 transition-colors"
              >
                <div className="px-4 pb-4">
                  <div className="p-3 bg-black/30 border border-border/30 rounded font-mono text-sm text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">
                    {displayContent}
                    {shouldTruncate && (
                      <button 
                        onClick={() => {
                          const next = new Set(expandedIds);
                          if (next.has(thread.id)) next.delete(thread.id);
                          else next.add(thread.id);
                          setExpandedIds(next);
                        }}
                        className="text-primary hover:underline ml-2 text-[10px] uppercase tracking-widest inline-flex items-center gap-1"
                      >
                        {isExpanded ? <><ChevronUp className="w-3 h-3"/> Show Less</> : <><ChevronDown className="w-3 h-3"/> Show All</>}
                      </button>
                    )}
                  </div>

                  {/* Display Attachment if Exists */}
                  {thread.mediaData && thread.mediaType && (
                    <div className="mb-4">
                      {thread.mediaType.startsWith('image/') ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={thread.mediaData} alt="Thread attachment" className="max-w-full h-auto max-h-[400px] rounded border border-border/40" />
                      ) : (
                        <a href={thread.mediaData} download={`attachment_${thread.id}`} className="inline-flex items-center gap-2 text-primary hover:underline font-mono text-sm p-3 bg-black/40 border border-primary/20 rounded">
                          <Paperclip className="w-4 h-4" /> Download Attached File
                        </a>
                      )}
                    </div>
                  )}
                  
                  {/* VOTING BAR */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleVote(thread.id, 'UPVOTE')}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs font-mono font-bold ${thread.upvotedByIds?.includes(currentUser?.id) ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-primary hover:bg-white/5 border border-transparent'}`}
                      >
                        <ChevronUp className="w-4 h-4" /> {thread.upvotedByIds?.length || 0}
                      </button>
                      <button 
                        onClick={() => handleVote(thread.id, 'DOWNVOTE')}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs font-mono font-bold ${thread.downvotedByIds?.includes(currentUser?.id) ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'text-muted-foreground hover:text-destructive hover:bg-white/5 border border-transparent'}`}
                      >
                        <ChevronDown className="w-4 h-4" /> {thread.downvotedByIds?.length || 0}
                      </button>
                    </div>
                  </div>

                </div>
              </DataCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
