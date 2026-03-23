"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { ExerciseCard } from "./exercise-card";
import { CompleteWorkoutButton } from "./complete-workout-button";
import { StartWorkoutButton } from "./start-workout-button";
import { LocalWorkoutSession, saveLocalSession, getLocalSession, clearLocalSession, getInProgressSession, WorkoutSet } from "../_lib/local-storage";
import type { GetWorkoutDay200ExercisesItem, GetWorkoutDay200SessionsItem } from "@/app/_lib/api/fetch-generated";
import { completeWorkoutAction } from "../_actions";
import { useRouter } from "next/navigation";
import { Plus, Timer as TimerIcon, Zap } from "lucide-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Button } from "@/components/ui/button";

dayjs.extend(duration);

interface WorkoutTrackerProps {
  workoutPlanId: string;
  workoutDayId: string;
  exercises: GetWorkoutDay200ExercisesItem[];
  sessions: GetWorkoutDay200SessionsItem[];
}

export function WorkoutTracker({
  workoutPlanId,
  workoutDayId,
  exercises,
  sessions,
}: WorkoutTrackerProps) {
  const router = useRouter();
  const [session, setSession] = useState<LocalWorkoutSession | null>(null);
  const [isPending, startTransition] = useTransition();
  const [elapsedTime, setElapsedTime] = useState<string>("0min 0s");
  
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [editMinutes, setEditMinutes] = useState(0);
  const [editSeconds, setEditSeconds] = useState(0);

  const [restTimeLeft, setRestTimeLeft] = useState<number | null>(null);

  const inProgressServerSession = sessions.find(
    (s) => s.startedAt && !s.completedAt,
  );
  const completedServerSession = sessions.find((s) => s.completedAt);

  const getEffectiveStartedAt = () => {
    return inProgressServerSession?.startedAt || session?.customStartedAt;
  };

  const formatDuration = (startStr: string, endStr?: string) => {
    const start = dayjs(startStr);
    const end = endStr ? dayjs(endStr) : dayjs();
    const diff = end.diff(start);
    const dur = dayjs.duration(diff);
    
    const h = Math.floor(dur.asHours());
    const m = dur.minutes();
    const s = dur.seconds();
    
    if (h > 0) {
      return `${h}h ${m}min ${s}s`;
    }
    return `${m}min ${s}s`;
  };

  const formatSeconds = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const playFeedback = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
        oscillator.stop(context.currentTime + 1);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  }, []);

  useEffect(() => {
    if (restTimeLeft === null) return;
    if (restTimeLeft <= 0) {
      playFeedback();
      setRestTimeLeft(null);
      return;
    }
    const interval = setInterval(() => {
      setRestTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimeLeft, playFeedback]);

  useEffect(() => {
    async function initSession() {
      if (inProgressServerSession) {
        const local = await getLocalSession(inProgressServerSession.id);
        if (local) {
          setSession(local);
        } else {
          const newLocal: LocalWorkoutSession = {
            sessionId: inProgressServerSession.id,
            workoutPlanId,
            workoutDayId,
            exercises: exercises.map((ex) => ({
              exerciseId: ex.id,
              sets: Array.from({ length: ex.sets || 0 }).map((_, i) => ({
                order: i + 1,
                reps: ex.reps || 0,
                weight: 0,
                completed: false,
              })),
            })),
          };
          await saveLocalSession(newLocal);
          setSession(newLocal);
        }
      } else {
        const local = await getInProgressSession(workoutPlanId, workoutDayId);
        if (local) {
          setSession(null);
        }
      }
    }
    initSession();
  }, [inProgressServerSession, workoutPlanId, workoutDayId, exercises]);

  useEffect(() => {
    const startedAt = getEffectiveStartedAt();
    if (!startedAt) {
      setElapsedTime("0min 0s");
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(formatDuration(startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.customStartedAt, inProgressServerSession?.startedAt]);

  const handleUpdateExercise = async (exerciseId: string, sets: WorkoutSet[]) => {
    if (!session) return;
    const newSession = {
      ...session,
      exercises: session.exercises.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, sets } : ex
      ),
    };
    setSession(newSession);
    await saveLocalSession(newSession);
  };

  const handleStartRestTimer = (seconds: number) => {
    setRestTimeLeft(seconds);
  };

  const handleStartEditTimer = () => {
    const startedAt = getEffectiveStartedAt();
    if (!startedAt) return;
    
    const start = dayjs(startedAt);
    const now = dayjs();
    const diff = now.diff(start);
    const dur = dayjs.duration(diff);
    
    setEditMinutes(Math.floor(dur.asMinutes()));
    setEditSeconds(dur.seconds());
    setIsEditingTimer(true);
  };

  const handleSaveTimer = async () => {
    if (!session) return;
    
    const newStartedAt = dayjs()
      .subtract(editMinutes, "minutes")
      .subtract(editSeconds, "seconds")
      .toISOString();
      
    const newSession = {
      ...session,
      customStartedAt: newStartedAt,
    };
    
    setSession(newSession);
    await saveLocalSession(newSession);
    setIsEditingTimer(false);
  };

  const handleComplete = () => {
    if (!session || !inProgressServerSession) return;

    startTransition(async () => {
      const payload = session.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        restTimeInSeconds: exercises.find(e => e.id === ex.exerciseId)?.restTimeInSeconds || 0,
        sets: ex.sets
          .filter(s => s.completed)
          .map(s => ({
            order: s.order,
            reps: s.reps,
            weight: s.weight,
          })),
      }));

      await completeWorkoutAction(workoutPlanId, workoutDayId, inProgressServerSession.id, payload);
      await clearLocalSession(session.sessionId);
      router.refresh();
    });
  };

  if (!inProgressServerSession && !completedServerSession) {
    return (
      <div className="flex flex-col gap-3">
        {exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
      </div>
    );
  }

  if (completedServerSession) {
    const finalDuration = completedServerSession.startedAt && completedServerSession.completedAt 
      ? formatDuration(completedServerSession.startedAt, completedServerSession.completedAt)
      : "0min 0s";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 opacity-80">
          <div className="flex items-center gap-2">
            <TimerIcon className="size-4 text-muted-foreground" />
            <span className="font-heading text-sm font-semibold text-muted-foreground">Treino Concluído em</span>
          </div>
          <span className="font-heading text-base font-bold text-muted-foreground">{finalDuration}</span>
        </div>

        {exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <TimerIcon className="size-4 text-primary" />
          <span className="font-heading text-sm font-semibold text-foreground">Duração do Treino</span>
        </div>
        
        {isEditingTimer ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={editMinutes}
                onChange={(e) => setEditMinutes(Number(e.target.value))}
                className="w-12 rounded border border-primary/30 bg-background px-1 text-center font-heading text-sm font-bold text-primary"
              />
              <span className="text-[10px] font-bold text-primary/60 uppercase">min</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={editSeconds}
                onChange={(e) => setEditSeconds(Number(e.target.value))}
                className="w-12 rounded border border-primary/30 bg-background px-1 text-center font-heading text-sm font-bold text-primary"
              />
              <span className="text-[10px] font-bold text-primary/60 uppercase">s</span>
            </div>
            <Button size="sm" onClick={handleSaveTimer} className="h-7 px-2 text-[10px]">
              OK
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-primary">{elapsedTime}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartEditTimer}
              className="size-7 rounded-lg text-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="size-3.5 rotate-45" />
            </Button>
          </div>
        )}
      </div>

      {exercises
        .sort((a, b) => a.order - b.order)
        .map((exercise) => {
          const sessionExercise = session?.exercises.find(
            (e) => e.exerciseId === exercise.id
          );
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              initialSets={sessionExercise?.sets}
              onUpdateSets={(sets) => handleUpdateExercise(exercise.id, sets)}
              onSetCompleted={() => handleStartRestTimer(exercise.restTimeInSeconds || 60)}
              isTracking={!!inProgressServerSession}
            />
          );
        })}

      {inProgressServerSession && (
        <div className="pt-5">
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressServerSession.id}
            onComplete={handleComplete}
            isPending={isPending}
          />
        </div>
      )}

      {restTimeLeft !== null && (
        <div className="fixed bottom-[100px] left-5 right-5 z-[60] flex animate-in fade-in slide-in-from-bottom-4 items-center justify-between rounded-2xl bg-primary px-6 py-4 shadow-xl shadow-primary/20 ring-1 ring-white/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap className="size-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-white/70">Descanso Ativo</span>
              <span className="font-heading text-sm font-bold text-white">Prepare-se para a próxima série</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-2xl font-black tabular-nums text-white">
              {formatSeconds(restTimeLeft)}
            </span>
            <button 
              onClick={() => setRestTimeLeft(null)}
              className="font-heading text-[10px] font-bold uppercase text-white/60 hover:text-white"
            >
              Pular
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
