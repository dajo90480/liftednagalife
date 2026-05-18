import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getWorkoutById } from '@/data/workouts';
import EditWorkoutForm from './EditWorkoutForm';

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const id = Number(workoutId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const { userId } = await auth();
  if (!userId) return null;

  const workout = await getWorkoutById(id, userId);
  if (!workout) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Lifted</p>
          <h1 className="text-4xl font-black tracking-tight mt-1">Edit Workout</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout details</CardTitle>
          </CardHeader>
          <CardContent>
            <EditWorkoutForm
              workoutId={workout.id}
              initialTitle={workout.title ?? ''}
              initialName={workout.name ?? ''}
              initialDate={workout.startedAt}
            />
          </CardContent>
        </Card>

        <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost' }))}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
