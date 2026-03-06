
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getHomeData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";
import { HomeBanner } from "@/components/HomeBanner";
import { ConsistencyGrid } from "@/components/ConsistencyGrid";
import { WorkoutCard } from "@/components/WorkoutCard";
import { BottomNav } from "@/components/BottomNav";

const WEEKDAY_MAP: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    }
  });
  
  if (!session.data?.user) redirect("/auth");

  const todayStr = dayjs().format("YYYY-MM-DD");
  const response = await getHomeData(todayStr);
  
  // Basic error handling/empty state
  if (response.status !== 200) {
    return <div>Erro ao carregar dados</div>;
  }

  const { data } = response;
  const todayWorkout = data.todayWorkoutDay;

  return (
    <div className="flex min-h-screen flex-col bg-primary font-inter-tight pb-24">
      <HomeBanner userName={session.data.user.name} />
      
      <main className="flex flex-col gap-6 -mt-5 px-5 relative z-30">
        <ConsistencyGrid 
          streak={data.workoutStreak} 
          consistencyByDay={data.consistencyByDay} 
        />

        {todayWorkout && (
          <WorkoutCard
            title="Treino de Hoje"
            name={todayWorkout.name}
            duration={`${Math.round(todayWorkout.estimatedDurationInSeconds / 60)}min`}
            exercisesCount={todayWorkout.exercisesCount}
            imageUrl={todayWorkout.coverImageUrl}
            badge={WEEKDAY_MAP[todayWorkout.weekDay]}
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
