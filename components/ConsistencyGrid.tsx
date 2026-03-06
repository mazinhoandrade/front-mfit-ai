
import { Flame } from "lucide-react";
import { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";

interface ConsistencyGridProps {
  streak: number;
  consistencyByDay: GetHomeData200ConsistencyByDay;
}

const WEEK_DAYS = ["S", "T", "Q", "Q", "S", "S", "D"];

export function ConsistencyGrid({ streak, consistencyByDay }: ConsistencyGridProps) {
  // Logic to map the week starting from Monday
  const today = dayjs();
  // Get the Monday of the current week
  const startOfWeek = today.subtract(today.day() === 0 ? 6 : today.day() - 1, 'day');

  return (
    <div className="flex flex-col gap-3 p-5 bg-white rounded-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-zinc-900 text-lg font-semibold">Consistência</h3>
        <button className="text-[#2B54FF] text-sm font-medium">Ver histórico</button>
      </div>

      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2.5">
          {WEEK_DAYS.map((day, index) => {
            const dateStr = startOfWeek.add(index, 'day').format('YYYY-MM-DD');
            const data = consistencyByDay[dateStr];
            
            let bgColor = "bg-white border border-[#F1F1F1]";
            if (data?.workoutDayCompleted) {
              bgColor = "bg-[#2B54FF] border-none";
            } else if (data?.workoutDayStarted) {
              bgColor = "bg-[#D5DFFE] border-none";
            }

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center`}>
                  <span className={`text-[13px] font-medium ${data?.workoutDayCompleted ? 'text-white' : 'text-zinc-900'}`}>
                    {day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-[#2B54FF]/10 px-3 py-2 rounded-xl">
          <span className="text-[#2B54FF] font-bold text-lg">{streak}</span>
          <Flame className="w-5 h-5 text-[#2B54FF] fill-[#2B54FF]" />
        </div>
      </div>
    </div>
  );
}
