import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "@/contexts/user";
import { ToastContainer } from "react-toastify";
import { getAssetsByOwner } from "@/utils/getAssetsByOwner";
import Navbar from "@/components/navbar";
import Loader from "@/components/loader";
import Builder from "@/components/profile/builder/Builder";
import apiClient from "@/utils/client/apiClient";
import { toast } from "react-toastify";

export default function Profile() {
  const [user] = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [initialRows, setInitialRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (user) => {
    try {
      // Fetch all NFTs
      const assets = await getAssetsByOwner(user.publicKey);
      setNfts(assets);

      // Fetch existing gallery rows
      const res = await apiClient.post("/getGalleryMintlist", { address: user.publicKey });
      if (res.status === 200 && res.data.galleryRows) {
        setInitialRows(res.data.galleryRows);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData(user);
  }, [user, fetchData]);

  const saveGallery = useCallback(async (galleryRows) => {
    if (!user?.apiKey) {
      console.error('No user or apiKey available');
      return Promise.reject();
    }
    
    try {
      console.log('Saving gallery rows:', galleryRows);
      
      const res = await apiClient.post("/saveGalleryRows", {
        apiKey: user.apiKey,
        galleryRows: galleryRows
      });

      if (res.status === 200) {
        // Don't show toast on every auto-save to avoid spam
        return Promise.resolve();
      } else {
        toast.error(res.data?.error || "Failed to save gallery");
        return Promise.reject();
      }
    } catch (err) {
      console.error("Error saving gallery:", err);
      toast.error("Failed to save gallery");
      return Promise.reject();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" theme="dark" />
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader text="Loading Art" />
        </div>
      ) : (
        <Builder
          allNfts={nfts}
          initialRows={initialRows}
          onSave={saveGallery}
        />
      )}
    </>
  );
}
