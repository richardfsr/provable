import { Droppable, Draggable } from "@hello-pangea/dnd";
import NftThumbnail from "./NftThumbnail";

export default function NftRow({ row, dragHandleProps, onDelete, onRemoveNft, nftMap }) {
  const nfts = (row.nftMints || []).map(mintId => nftMap.get(mintId)).filter(Boolean);
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3'
  }[nfts.length] || 'grid-cols-3';

  return (
    <div className="bg-white border border-neutral-300 rounded overflow-hidden hover:shadow-md transition-shadow">
      {/* Toolbar */}
      <div className="bg-neutral-100 border-b border-neutral-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-move text-gray-500 hover:text-gray-700 text-xl"
            title="Drag to reorder"
          >
            ≡
          </div>
          <span className="text-sm font-medium text-gray-700">
            NFT Row ({nfts.length}/3)
          </span>
        </div>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
          title="Delete row"
        >
          Delete
        </button>
      </div>

      {/* NFT Grid */}
      <Droppable droppableId={row.id} type="NFT" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[200px] ${
              snapshot.isDraggingOver 
                ? (nfts.length >= 3 ? 'bg-red-100' : 'bg-green-100') 
                : 'bg-white'
            }`}
          >
            {nfts.length === 0 ? (
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-neutral-300 text-gray-400">
                Drag NFTs here (max 3)
              </div>
            ) : (
              <div className={`grid ${gridClass} gap-4`}>
                {nfts.map((nft, index) => (
                  <Draggable
                    key={nft.id}
                    draggableId={`${row.id}-${nft.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'opacity-50' : ''}
                      >
                        <NftThumbnail
                          nft={nft}
                          showName={false}
                          onRemove={() => onRemoveNft(nft.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
            {provided.placeholder}
            {snapshot.isDraggingOver && nfts.length >= 3 && (
              <div className="text-center text-red-600 font-bold mt-2">
                Max 3 NFTs per row
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
