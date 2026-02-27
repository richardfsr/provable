import { useState, useEffect } from "react";
import { getAssetsByOwner } from "@/utils/getAssetsByOwner";
import apiClient from "@/utils/client/apiClient";
import Loader from "@/components/loader";
import TextRowDisplay from "@/components/gallery/TextRowDisplay";
import NftRowDisplay from "@/components/gallery/NftRowDisplay";
import NftModal from "@/components/gallery/NftModal";

export default function Gallery({ address }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [nftMap, setNftMap] = useState(new Map());
  const [selectedNft, setSelectedNft] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getGalleryData = async (address) => {
    try {
      // Fetch gallery rows
      const res = await apiClient.post("/getGalleryMintlist", { address });
      const galleryRows = res.data?.galleryRows || [];

      if (galleryRows.length > 0) {
        // Fetch all NFTs to get metadata
        const allNfts = await getAssetsByOwner(address);
        const nftLookup = new Map(allNfts.map(nft => [nft.id, nft]));
        setNftMap(nftLookup);
      }

      setRows(galleryRows);
    } catch (err) {
      console.error("Error loading gallery:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGalleryData(address);
  }, [address]);

  const handleOpenModal = (nft) => {
    setSelectedNft(nft);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNft(null);
  };

  return (
    <>
      <div className="mx-auto relative overflow-x-hidden">
        {loading ? (
          <div className="text-center mt-1/3">
            <Loader text="Loading Art" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No gallery content yet</p>
          </div>
        ) : (
          <div>
            {rows.map((row, index) => (
              <div key={row.id || index}>
                {row.type === 'text' ? (
                  <TextRowDisplay row={row} />
                ) : (
                  <NftRowDisplay 
                    row={row} 
                    nftMap={nftMap} 
                    onOpenModal={handleOpenModal}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NFT Details Modal */}
      <NftModal 
        nft={selectedNft}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
