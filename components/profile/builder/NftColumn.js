import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import NftThumbnail from "./NftThumbnail";

export default function NftColumn({ nfts, searchQuery, setSearchQuery }) {
  return (
    <div className="w-80 h-screen bg-neutral-100 border-r border-neutral-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-300">
        <h3 className="font-bold text-lg mb-3">Available NFTs</h3>
        <input
          type="text"
          placeholder="Search NFTs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
        />
        <div className="mt-2 text-xs text-gray-600">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* NFT Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {nfts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchQuery ? 'No NFTs found' : 'All NFTs are in use'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {nfts.map((nft, index) => (
              <Draggable
                key={nft.id}
                draggableId={`nft-${nft.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`cursor-move ${snapshot.isDragging ? 'opacity-50' : ''}`}
                  >
                    <NftThumbnail nft={nft} showName={true} />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
