"use server";

import { revalidatePath } from "next/cache";
import {
  finishWorkoutSession,
  startWorkoutSession,
} from "@/app/_lib/api/fetch-generated";

export async function startWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
) {
  await startWorkoutSession(workoutPlanId, workoutDayId);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}

export async function completeWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
  exercises: {
    exerciseId: string;
    restTimeInSeconds: number;
    sets: {
      order: number;
      reps?: number;
      weight?: number;
    }[];
  }[],
) {
  await finishWorkoutSession(workoutPlanId, workoutDayId, sessionId, {
    completedAt: new Date().toISOString(),
    exercises: exercises,
  });
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}