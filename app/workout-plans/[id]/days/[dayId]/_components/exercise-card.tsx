"use client";

import { CircleHelp, Zap, Plus, Trash2, Check } from "lucide-react";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import type { WorkoutSet } from "../_lib/local-storage";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
  initialSets?: WorkoutSet[];
  onUpdateSets?: (sets: WorkoutSet[]) => void;
  onSetCompleted?: () => void;
  isTracking?: boolean;
}

export function ExerciseCard({
  exercise,
  initialSets = [],
  onUpdateSets,
  onSetCompleted,
  isTracking = false,
}: ExerciseCardProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  function formatSeconds(seconds: number): string {
    if (!seconds || seconds <= 0) return "0s";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }

  const handleHelp = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Como executar o exercício ${exercise.name} corretamente?`,
    });
  };

  const handleAddSet = () => {
    const lastSet = initialSets[initialSets.length - 1];
    const newSets = [
      ...initialSets,
      {
        order: initialSets.length + 1,
        reps: lastSet ? lastSet.reps : (exercise.reps || 0),
        weight: lastSet ? lastSet.weight : 0,
        completed: false,
      },
    ];
    onUpdateSets?.(newSets);
  };

  const handleDeleteSet = (index: number) => {
    const newSets = initialSets
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, order: i + 1 }));
    onUpdateSets?.(newSets);
  };

  const handleUpdateSet = (index: number, updates: Partial<WorkoutSet>) => {
    const newSets = initialSets.map((s, i) =>
      i === index ? { ...s, ...updates } : s,
    );

    // Trigger global rest timer if set is newly completed
    if (updates.completed === true && !initialSets[index].completed) {
      onSetCompleted?.();
    }

    onUpdateSets?.(newSets);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-foreground">
          {exercise.name}
        </span>
        <Button variant="ghost" size="icon" onClick={handleHelp}>
          <CircleHelp className="size-5 text-muted-foreground" />
        </Button>
      </div>

      {!isTracking ? (
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {exercise.sets} séries
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {exercise.reps} reps
          </span>
          <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            <Zap className="size-3.5" />
            {formatSeconds(exercise.restTimeInSeconds as number)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[32px_0.8fr_1.5fr_1.5fr_1.5fr_40px] items-center gap-2 px-1 text-[10px] font-bold uppercase text-muted-foreground/60">
            <div />
            <span>Série</span>
            <span>Anterior</span>
            <span>Peso (kg)</span>
            <span>Reps</span>
            <div />
          </div>

          <div className="flex flex-col gap-2">
            {initialSets.map((set, index) => (
              <div
                key={index}
                className="grid grid-cols-[32px_0.8fr_1.5fr_1.5fr_1.5fr_40px] items-center gap-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSet(index)}
                  className="size-8 rounded-lg text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <div
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg bg-muted font-heading text-sm font-bold",
                    set.completed && "bg-primary text-primary-foreground",
                  )}
                >
                  {set.order}
                </div>
                <div className="flex h-9 items-center justify-center rounded-lg border border-dashed border-border text-[10px] font-medium text-muted-foreground/60">
                  {/* API doesn't provide history yet, showing placeholder */}
                  ---
                </div>
                <Input
                  type="number"
                  value={set.weight || ""}
                  onChange={(e) =>
                    handleUpdateSet(index, { weight: Number(e.target.value) })
                  }
                  className="h-9 px-1 text-center text-sm"
                  placeholder="0"
                />
                <Input
                  type="number"
                  value={set.reps || ""}
                  onChange={(e) =>
                    handleUpdateSet(index, { reps: Number(e.target.value) })
                  }
                  className="h-9 px-1 text-center text-sm"
                  placeholder="0"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      handleUpdateSet(index, { completed: !set.completed })
                    }
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg border transition-colors",
                      set.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    <Check className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSet}
              className="h-8 w-full gap-1.5 rounded-lg border-dashed text-xs"
            >
              <Plus className="size-3.5" />
              Adicionar Série
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
