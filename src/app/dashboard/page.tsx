import { auth } from '@clerk/nextjs/server';
import { getWorkoutsByUser } from '@/data/workouts';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const { userId } = await auth();

  const workouts = userId ? await getWorkoutsByUser(userId) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Lifted</p>
          <h1 className="text-4xl font-black tracking-tight mt-1">Dashboard</h1>
        </div>

        <DashboardClient workouts={workouts} />
      </div>
    </div>
  );
}
