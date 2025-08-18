import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/user";
import ConnectWallet from "@/components/login/connect_wallet";
import Navbar from "@/components/navbar";

export default function NavBar() {
  const router = useRouter();
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-32">
        <h1 className="text-2xl mb-2">Log In</h1>
        <p className="font-sans mb-8">Connect your wallet to get started</p>
        <ConnectWallet />
      </div>
    </>
  );
}
