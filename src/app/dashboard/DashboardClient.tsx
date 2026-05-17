'use client';

import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Workout = {
  id: number;
  name: string | null;
  title: string | null;
  startedAt: Date;
  completedAt: Date | null;
};

export default function DashboardClient({ workouts }: { workouts: Workout[] }) {
  const [date, setDate] = useState<Date>(new Date());

  const dayWorkouts = workouts.filter((w) => isSameDay(w.startedAt, date));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-24 items-start w-full">
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => { if (d) setDate(d); }}
          initialFocus
        />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Workouts</p>
          <h2 className="text-2xl font-black tracking-tight">{format(date, 'do MMM yyyy')}</h2>
        </div>

        {dayWorkouts.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">No workouts logged for this date.</p>
            <Button className="font-bold">Log New Workout</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayWorkouts.map((workout) => (
              <Card key={workout.id} className="shadow-sm">
                <CardContent className="py-4 px-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-black text-base tracking-tight">{workout.title ?? workout.name ?? 'Workout'}</p>
                    <p className="text-sm text-muted-foreground">{format(workout.startedAt, 'do MMM yyyy, h:mm a')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {workout.completedAt && (
                      <Badge variant="secondary" className="font-bold text-xs">Completed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
