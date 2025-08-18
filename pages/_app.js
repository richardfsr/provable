import "@/styles/globals.css";
import Head from "next/head";

import { WalletContextProvider } from "@/contexts/wallet";
import { UserProvider } from "@/contexts/user";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Provable Art</title>
      </Head>
      <WalletContextProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </WalletContextProvider>
    </>
  );
}
