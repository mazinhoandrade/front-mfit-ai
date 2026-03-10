import { Chatbot } from "@/app/_components/chatbot";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex h-svh w-full flex-col bg-background overflow-y-auto">
      <Chatbot
        mode="page" 
        customHeader={
          <Link href="/">
            <Button variant="outline" className="rounded-full border-primary text-primary hover:text-primary">
              Acessar FIT.AI
            </Button>
          </Link>
        }
      />
    </div>
  );
}
