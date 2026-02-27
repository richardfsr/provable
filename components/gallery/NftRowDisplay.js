import { LazyLoadImage } from "react-lazy-load-image-component";

export default function NftRowDisplay({ row, nftMap, onOpenModal }) {
  const nfts = (row.nftMints || [])
    .map(mintId => nftMap.get(mintId))
    .filter(Boolean);

  if (nfts.length === 0) return null;

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3'
  }[nfts.length] || 'grid-cols-3';

  return (
    <div className="mb-12">
      <div className={`grid ${gridClass} gap-4`}>
        {nfts.map((nft, index) => {
          const imageUrl = nft.content?.files[0]?.cdn_uri || nft.content?.files[0]?.uri;
          const name = nft.content?.metadata?.name || "Untitled";

          return (
            <div
              key={nft.id || index}
              onClick={() => onOpenModal(nft)}
              className="cursor-pointer group overflow-hidden bg-neutral-100 transition-all hover:shadow-xl"
            >
              <div className="aspect-square w-full overflow-hidden">
                {imageUrl && (
                  <LazyLoadImage
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
