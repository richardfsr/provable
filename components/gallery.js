import { useState, useEffect } from "react";
import { getAssetsByOwner } from "@/utils/getAssetsByOwner";
import Loader from "@/components/loader";
import Nft from "@/components/nft/nft";

export default function Gallery({ address }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const getMetadatas = async (address) => {
    let tokens = await getAssetsByOwner(address);
    setItems(tokens[0]);
    setLoading(false);
  };

  useEffect(() => {
    getMetadatas(address);
  }, []);

  return (
    <div className="mx-auto relative overflow-x-hidden">
      {loading ? (
        <div className="text-center mt-1/3">
          <Loader text="Loading Art" />
        </div>
      ) : (
        <>
          <>
            {items.map((item, index) => (
              <Nft metadata={item} key={`nft-${index}`} />
            ))}
          </>
        </>
      )}
    </div>
  );
}
