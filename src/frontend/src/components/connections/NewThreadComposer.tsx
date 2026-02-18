import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateThread } from '../../hooks/useConnectionsForum';
import { normalizeForumError } from '../../utils/connectionsForumErrors';
import { toast } from 'sonner';

export default function NewThreadComposer() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createThread = useCreateThread();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    try {
      await createThread.mutateAsync({ title: title.trim(), content: content.trim() });
      toast.success('Thread created successfully!');
      setTitle('');
      setContent('');
      setOpen(false);
    } catch (error) {
      toast.error(normalizeForumError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.55_0.15_320)] text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>
              Start a new conversation with your connections.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter thread title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createThread.isPending}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="What would you like to discuss?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createThread.isPending}
                rows={6}
                maxLength={2000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createThread.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createThread.isPending || !title.trim() || !content.trim()}
              className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.55_0.15_320)] text-white"
            >
              {createThread.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Thread'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
