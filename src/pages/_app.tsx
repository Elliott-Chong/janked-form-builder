import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "sonner";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Providers>
      <SessionProvider session={session}>
        <main className={cn("grainy min-h-screen")}>
          <Component {...pageProps} />
          <Toaster richColors />
        </main>
      </SessionProvider>
    </Providers>
  );
};

export default api.withTRPC(MyApp);
