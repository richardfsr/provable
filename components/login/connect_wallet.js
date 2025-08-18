import React, { useEffect, useContext, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "@/contexts/user";
import apiClient from "@/utils/client/apiClient";

import getApiKey from "@/utils/user/getApiKey";

export default function ConnectWallet({ login = true }) {
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  const asyncGetApiKey = useCallback(async (publicKey, signMessage) => {
    if (!publicKey || !signMessage) return;

    try {
      let res = await getApiKey(publicKey, signMessage);
      localStorage.setItem("api_key", res.user.apiKey);
      setUser(res.user);
    } catch (err) {
      // console.log(err);
    }
  }, []);

  const asyncGetUser = useCallback(async (apiKey, publicKey, signMessage) => {
    const res = await apiClient.post("/getUserFromAPIKey", { apiKey: apiKey });
    if (res.status === 200) {
      setUser(res.data.user);
    } else if (res.status === 404) {
      localStorage.removeItem("api_key");
      if (publicKey && signMessage) asyncGetApiKey(publicKey, signMessage);
    }
  }, []);

  useEffect(() => {
    if (!wallet || !wallet.connected || wallet.disconnecting) return;

    const apiKey = localStorage.getItem("api_key");
    if (apiKey) {
      asyncGetUser(apiKey, wallet.publicKey, wallet.signMessage);
    } else {
      if (login) asyncGetApiKey(wallet.publicKey, wallet.signMessage);
    }
  }, [wallet, asyncGetUser, asyncGetApiKey]);

  return <WalletMultiButtonDynamic />;
}
