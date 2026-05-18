'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createWorkout } from '@/data/workouts';

const CreateWorkoutSchema = z.object({
  name: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  startedAt: z.string().datetime(),
});

export async function createWorkoutAction(params: {
  name?: string;
  title?: string;
  startedAt: string;
}) {
  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error('Invalid input');
  }

  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  const workout = await createWorkout({
    userId,
    name: parsed.data.name,
    title: parsed.data.title,
    startedAt: new Date(parsed.data.startedAt),
  });

  return { id: workout.id };
}
