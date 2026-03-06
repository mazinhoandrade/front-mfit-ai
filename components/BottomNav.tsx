
import { Home, ClipboardList, TrendingUp, User, LayoutGrid } from "lucide-react";
import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F1F1] px-6 py-4 flex justify-between items-center z-50">
      <Link href="/" className="text-[#2B54FF]">
        <Home className="w-6 h-6" />
      </Link>
      <button className="text-zinc-400">
        <LayoutGrid className="w-6 h-6" />
      </button>
      <button className="text-zinc-400">
        <TrendingUp className="w-6 h-6" />
      </button>
      <button className="text-zinc-400">
        <ClipboardList className="w-6 h-6" />
      </button>
      <button className="text-zinc-400">
        <User className="w-6 h-6" />
      </button>
    </nav>
  );
}
