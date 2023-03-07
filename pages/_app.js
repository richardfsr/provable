import "../styles/globals.css";
import "../styles/toast.css";
import "../styles/wallet-adapter.css";

import { WalletContextProvider } from "/contexts/wallet";

function MyApp({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;
