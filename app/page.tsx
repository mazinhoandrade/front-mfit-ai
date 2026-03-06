
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getHomeData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";


export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    }
  });
  
  if (!session.data?.user) redirect("/auth");

  const homeData = await getHomeData(dayjs().format("2026-03-05"));



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        Mfit.ai
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Você está logado como {session.data?.user.name}
          </h1>
          <div>
           
          </div>
          {/* <button
            onClick={() => authClient.signOut()}
            className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sair
          </button> */}
        </div>
      </main>
    </div>
  );
}
