import { db } from '@/db';
import { workouts, workoutExercises, exercises, sets } from '@/db/schema';
import { eq, and, gte, lt } from 'drizzle-orm';

export async function getWorkoutsByUser(userId: string, date?: Date) {
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), gte(workouts.startedAt, start), lt(workouts.startedAt, end)));
  }

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getUserWorkoutWithExercises(workoutId: number) {
  return db
    .select({
      workout: workouts,
      workoutExercise: workoutExercises,
      exercise: exercises,
      set: sets,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .innerJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(eq(workouts.id, workoutId))
    .orderBy(workoutExercises.order, sets.setNumber);
}
