import { authClient } from "@/app/_lib/auth-client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SignInWithGoogle } from "./_components/sign-in-with-google";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-black font-sans text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginImage.png"
          alt="Treino"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center pt-12">
        <h1 className="text-[38px] font-bold tracking-tighter italic leading-none">
          MFit.ai
        </h1>
      </div>
      <div className="relative z-10 w-full max-w-md rounded-t-[20px] bg-primary px-5 pt-12 pb-10 flex flex-col items-center text-center gap-[60px]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[32px] font-semibold leading-[1.05] text-white">
            O app que vai transformar a forma como você treina.
          </h2>
          <SignInWithGoogle />
        </div>

        <p className="text-[12px] opacity-70">
          ©2026 Copyright MFIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
