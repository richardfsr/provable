import { LazyLoadImage } from "react-lazy-load-image-component";

export default function NftThumbnail({ nft, isDraggable = true, showName = true, onRemove }) {
  const imageUrl = nft?.content?.files[0]?.cdn_uri || nft?.content?.files[0]?.uri;
  const name = nft?.content?.metadata?.name || "Untitled";

  return (
    <div className="relative group">
      <div className="aspect-square w-full bg-neutral-200 overflow-hidden">
        {imageUrl && (
          <LazyLoadImage
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      {showName && (
        <div className="mt-1 text-xs text-gray-700 truncate px-1">
          {name}
        </div>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Remove NFT"
        >
          ×
        </button>
      )}
    </div>
  );
}
