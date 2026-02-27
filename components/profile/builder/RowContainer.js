import { Droppable, Draggable } from "@hello-pangea/dnd";
import TextRow from "./TextRow";
import NftRow from "./NftRow";
import EmptyState from "./EmptyState";

export default function RowContainer({ 
  rows, 
  onAddTextRow, 
  onAddNftRow, 
  onUpdateTextRow,
  onDeleteRow,
  onRemoveNftFromRow,
  nftMap
}) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      {rows.length === 0 ? (
        <EmptyState onAddTextRow={onAddTextRow} onAddNftRow={onAddNftRow} />
      ) : (
        <Droppable droppableId="rows" type="ROW">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="max-w-4xl mx-auto"
            >
              {rows.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`mb-6 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      {row.type === 'text' ? (
                        <TextRow
                          row={row}
                          dragHandleProps={provided.dragHandleProps}
                          onUpdate={onUpdateTextRow}
                          onDelete={() => onDeleteRow(row.id)}
                        />
                      ) : (
                        <NftRow
                          row={row}
                          dragHandleProps={provided.dragHandleProps}
                          onDelete={() => onDeleteRow(row.id)}
                          onRemoveNft={(mintId) => onRemoveNftFromRow(row.id, mintId)}
                          nftMap={nftMap}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* Add Row Buttons */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={onAddTextRow}
                  className="py-2 px-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  + Add Text Row
                </button>
                <button
                  onClick={onAddNftRow}
                  className="py-2 px-4 bg-neutral-700 text-white font-bold hover:bg-neutral-600 transition-colors"
                >
                  + Add NFT Row
                </button>
              </div>
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}
