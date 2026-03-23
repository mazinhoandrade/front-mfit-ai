"use client";

import { Button } from "@/components/ui/button";

interface CompleteWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  onComplete?: () => void;
  isPending?: boolean;
}

export function CompleteWorkoutButton({
  onComplete,
  isPending,
}: CompleteWorkoutButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onComplete}
      disabled={isPending}
      className="w-full rounded-full py-3 font-heading text-sm font-semibold"
    >
      Marcar como concluído
    </Button>
  );
}