
import { Calendar, Timer, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface WorkoutCardProps {
  title: string;
  name: string;
  duration: string;
  exercisesCount: number;
  imageUrl?: string;
  badge?: string;
}

export function WorkoutCard({ title, name, duration, exercisesCount, imageUrl, badge }: WorkoutCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-zinc-900 text-lg font-semibold">{title}</h3>
        <button className="text-[#2B54FF] text-sm font-medium">Ver treinos</button>
      </div>

      <Link href="#" className="relative w-full h-[180px] rounded-3xl overflow-hidden group">
        <Image
          src={imageUrl || "/figma-assets/workout-card-bg.png"}
          alt={name}
          fill
          className="object-cover z-0 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-between p-5">
          {badge && (
            <Badge className="w-fit bg-white/20 backdrop-blur-md text-white border-none flex gap-1.5 items-center px-2 py-1 uppercase text-[10px] font-bold">
              <Calendar className="w-3 h-3" />
              {badge}
            </Badge>
          )}
          
          <div className="flex flex-col gap-1">
            <h4 className="text-white text-xl font-bold">{name}</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <Timer className="w-3.5 h-3.5" />
                {duration}
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <Dumbbell className="w-3.5 h-3.5" />
                {exercisesCount} exercícios
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
