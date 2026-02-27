import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function NftModal({ nft, isOpen, onClose }) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !nft) return null;

  const imageUrl = nft.content?.files[0]?.cdn_uri || nft.content?.files[0]?.uri;
  const name = nft.content?.metadata?.name || "Untitled";
  const description = nft.content?.metadata?.description || "";
  const creatorAddress = nft.creators?.[0]?.address || "";
  const creatorName = nft.creators?.[0]?.name || (creatorAddress ? `${creatorAddress.slice(0, 4)}...${creatorAddress.slice(-4)}` : "Unknown Creator");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-neutral-100 flex items-center justify-center p-8">
            {imageUrl && (
              <LazyLoadImage
                src={imageUrl}
                alt={name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto">
            {/* NFT Name */}
            <h2 className="text-3xl font-bold mb-4 break-words">{name}</h2>

            {/* Creator */}
            {creatorAddress && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Creator</h3>
                <a
                  href={`https://solscan.io/account/${creatorAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {creatorName}
                </a>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            )}

            {/* Additional Links */}
            {nft.content?.links?.external_url && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={nft.content.links.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  View External Link
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
