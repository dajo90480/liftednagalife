import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import NewWorkoutForm from './NewWorkoutForm';

export default function NewWorkoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Lifted</p>
          <h1 className="text-4xl font-black tracking-tight mt-1">New Workout</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout details</CardTitle>
          </CardHeader>
          <CardContent>
            <NewWorkoutForm />
          </CardContent>
        </Card>

        <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost' }))}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
