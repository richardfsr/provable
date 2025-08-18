import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import apiClient from "@/utils/client/apiClient";
import Navbar from "@/components/navbar";
import Gallery from "@/components/gallery";

export default function Username() {
  const router = useRouter();
  const username = router.query.username;
  const [notFound, setNotFound] = useState(false);
  const [publicKey, setPublicKey] = useState();

  const fetchPublicKey = useCallback(async (username) => {
    const res = await apiClient.post("/getPublicKeyFromUsername", { username: username });
    if (res.status === 200) {
      setPublicKey(res.data.publicKey);
    } else {
      setNotFound(true);
    }
  }, []);

  useEffect(() => {
    if (username) fetchPublicKey(username);
  }, [username]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-32">
        <section>
          {notFound && <p>Username not found :(</p>}
          {publicKey && <Gallery address={publicKey} />}
        </section>
      </div>
    </>
  );
}
