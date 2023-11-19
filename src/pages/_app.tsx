import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Providers>
      <SessionProvider session={session}>
        <Navbar />
        <div className="h-20"></div>
        <Component {...pageProps} />
      </SessionProvider>
    </Providers>
  );
};

export default api.withTRPC(MyApp);
