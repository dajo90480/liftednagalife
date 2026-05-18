'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { updateWorkoutAction } from './actions';

interface Props {
  workoutId: number;
  initialTitle: string;
  initialName: string;
  initialDate: Date;
}

export default function EditWorkoutForm({ workoutId, initialTitle, initialName, initialDate }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);
  const [date, setDate] = useState<Date>(initialDate);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateWorkoutAction({
        workoutId,
        title: title || undefined,
        name: name || undefined,
        startedAt: date.toISOString(),
      });
      router.push('/dashboard');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g. Morning Push"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name / Type</Label>
        <Input
          id="name"
          placeholder="e.g. Push Day, Leg Day"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger
            className={cn(
              'inline-flex w-full items-center justify-start gap-2 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-normal text-left',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            {format(date, 'do MMM yyyy')}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  );
}
