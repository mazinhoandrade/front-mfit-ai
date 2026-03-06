
import { Button } from "@/components/ui/button";
import Image from "next/image";


interface HomeBannerProps {
  userName: string;
}

export function HomeBanner({ userName }: HomeBannerProps) {
  return (
    <div className="relative w-full h-[240px] rounded-b-[20px] overflow-hidden flex flex-col justify-end p-5">
      <Image
        src="/figma-assets/banner-bg.png"
        alt="Banner Background"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="relative z-20 flex flex-col gap-2">
        <h1 className="text-white text-3xl font-bold tracking-tight" >
          FIT.AI
        </h1>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-semibold leading-none">
              Olá, {userName}
            </h2>
            <p className="text-white/70 text-sm font-normal">
              Bora treinar hoje?
            </p>
          </div>
          <Button className="bg-[#2B54FF] hover:bg-[#2B54FF]/90 text-white rounded-full px-8 h-10 font-semibold">
            Bora!
          </Button>
        </div>
      </div>
    </div>
  );
}
