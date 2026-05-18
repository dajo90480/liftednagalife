'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { updateWorkout } from '@/data/workouts';

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  startedAt: z.string().datetime(),
});

export async function updateWorkoutAction(params: {
  workoutId: number;
  name?: string;
  title?: string;
  startedAt: string;
}) {
  const parsed = UpdateWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error('Invalid input');

  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  await updateWorkout(parsed.data.workoutId, userId, {
    name: parsed.data.name,
    title: parsed.data.title,
    startedAt: new Date(parsed.data.startedAt),
  });
}
