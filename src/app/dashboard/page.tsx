'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockWorkouts = [
  { id: 1, name: 'Morning Run', type: 'Cardio', duration: '45 min', notes: '5km at easy pace' },
  { id: 2, name: 'Upper Body Strength', type: 'Strength', duration: '60 min', notes: 'Bench, rows, OHP' },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Lifted</p>
          <h1 className="text-4xl font-black tracking-tight mt-1">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">

          {/* Calendar */}
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { if (d) setDate(d); }}
              initialFocus
            />
          </div>

          {/* Workouts for selected date */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Workouts</p>
              <h2 className="text-2xl font-black tracking-tight">
                {date ? format(date, 'do MMM yyyy') : '—'}
              </h2>
            </div>

            {mockWorkouts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workouts logged for this date.</p>
            ) : (
              <div className="space-y-3">
                {mockWorkouts.map((workout) => (
                  <Card key={workout.id} className="shadow-sm">
                    <CardContent className="py-4 px-5 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-black text-base tracking-tight">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.notes}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge variant="secondary" className="font-bold text-xs">{workout.type}</Badge>
                        <span className="text-xs font-semibold text-muted-foreground">{workout.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
