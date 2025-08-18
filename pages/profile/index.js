import { useState, useEffect, useContext, useCallback, useRef } from "react";
import UserContext from "@/contexts/user";
import { ToastContainer } from "react-toastify";
import { getAssetsByOwner } from "@/utils/getAssetsByOwner";
import Navbar from "@/components/navbar";
import Loader from "@/components/loader";
import Sortable from "@/components/profile/sortable";
import apiClient from "@/utils/client/apiClient";
import { toast } from "react-toastify";

export default function Profile() {
  const [user] = useContext(UserContext);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const childRef = useRef(null);

  const fetchTokens = useCallback(async (user) => {
    const assets = await getAssetsByOwner(user.publicKey);
    setTokens(assets);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchTokens(user);
  }, [user]);

  const updateMintlist = async () => {
    const sortel = childRef.current;
    const mintlist = sortel.gallery[0].map((i) => i.id);
    const res = await apiClient.post("/saveMintlist", { apiKey: user.apiKey, mints: mintlist })

    if (res.status === 200) {
      toast.success("Gallery saved");
    } else if (res.status === 400) {
      toast.error(res.data.error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" theme="dark" />
      <div className="max-w-5xl mx-auto mt-32">
        <div className="mb-8 p-2 bg-neutral-200 flex gap-2">
          <button
            className="py-2 px-4 bg-black text-white cursor-pointer hover:bg-gray-800 font-bold"
            onClick={() => updateMintlist()}
          >
            Save
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-1/3">
            <Loader text="Loading Art" />
          </div>
        ) : (
          <Sortable tokens={tokens} ref={childRef} />
        )}
      </div>
    </>
  );
}
