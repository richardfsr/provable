import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "@/contexts/user";

export default function NavBar() {
  const wallet = useWallet();
  const router = useRouter();
  const username = router.query.username;
  const [user, setUser] = useContext(UserContext);

  const signOut = async () => {
    wallet.disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
    });
  };

  return (
    <nav className="fixed left-4 right-4 lg:left-0 lg:right-0 top-0 z-40 bg-white backdrop-blur opacity-90 py-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-row justify-between items-center h-12">
          <div className="float-left">
            <span className="text-2xl font-bold align-middle">
              <Link href="/">
                <img src="/logo512.png" className="invert w-12" />
              </Link>
            </span>
          </div>
          <div className="float-right">
            {!username && (
              <>
                {!user && (
                  <>
                    <Link href={`/login`}>
                      <h1 className="mr-3 sm:mr-6 font-bold inline hover:underline text-sm">
                        Log In
                      </h1>
                    </Link>
                  </>
                )}
                {user && user.username && (
                  <>
                    <Link href={`/profile`}>
                      <h1 className="mr-3 sm:mr-6 font-bold inline hover:underline text-sm">
                        Profile
                      </h1>
                    </Link>
                  </>
                )}
                {user && (
                  <>
                    <Link href="/profile/settings">
                      <h1 className="mr-3 sm:mr-6 font-bold inline hover:underline text-sm">
                        Settings
                      </h1>
                    </Link>
                    <h1
                      className="font-bold inline hover:underline cursor-pointer text-sm"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </h1>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {user && !user.username && !username && (
        <div className="clear-both bg-neutral-100 text-black text-sm text-center p-2 left-0 right-0 mt-2">
          Please create a username in <Link href="/settings">settings</Link> to
          start your gallery
        </div>
      )}
    </nav>
  );
}
