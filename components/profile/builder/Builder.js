import { useState, useMemo } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import NftColumn from "./NftColumn";
import RowContainer from "./RowContainer";

export default function Builder({ allNfts, initialRows = [], onSave }) {
  const [galleryRows, setGalleryRows] = useState(initialRows);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Create NFT map for quick lookups
  const nftMap = useMemo(() => {
    return new Map(allNfts.map(nft => [nft.id, nft]));
  }, [allNfts]);

  // Filter available NFTs (exclude ones in rows, apply search)
  const availableNfts = useMemo(() => {
    const usedMintIds = new Set(
      galleryRows
        .filter(row => row.type === 'nft')
        .flatMap(row => row.nftMints || [])
    );

    return allNfts.filter(nft => 
      !usedMintIds.has(nft.id) &&
      (nft.content?.metadata?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [allNfts, galleryRows, searchQuery]);

  // Helper function to trigger save
  const triggerSave = async (rows) => {
    setIsSaving(true);
    try {
      await onSave(rows);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new text row
  const addTextRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      type: 'text',
      order: galleryRows.length,
      heading: '',
      content: ''
    };
    setGalleryRows([...galleryRows, newRow]);
  };

  // Add new NFT row
  const addNftRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      type: 'nft',
      order: galleryRows.length,
      nftMints: []
    };
    setGalleryRows([...galleryRows, newRow]);
  };

  // Update text row (called when Save button clicked)
  const updateTextRow = (rowId, data) => {
    const newRows = galleryRows.map(row =>
      row.id === rowId ? { ...row, ...data } : row
    );
    setGalleryRows(newRows);
    triggerSave(newRows); // Save immediately when text row is saved
  };

  // Delete row
  const deleteRow = (rowId) => {
    const newRows = galleryRows.filter(row => row.id !== rowId);
    setGalleryRows(newRows);
    triggerSave(newRows); // Save immediately after delete
  };

  // Remove NFT from row
  const removeNftFromRow = (rowId, mintId) => {
    const newRows = galleryRows.map(row =>
      row.id === rowId
        ? { ...row, nftMints: (row.nftMints || []).filter(id => id !== mintId) }
        : row
    );
    setGalleryRows(newRows);
    triggerSave(newRows); // Save immediately after removing NFT
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    // Reorder rows
    if (type === 'ROW') {
      const newRows = Array.from(galleryRows);
      const [removed] = newRows.splice(source.index, 1);
      newRows.splice(destination.index, 0, removed);
      
      // Update order
      newRows.forEach((row, index) => {
        row.order = index;
      });
      
      setGalleryRows(newRows);
      triggerSave(newRows); // Save after reordering rows
      return;
    }

    // Handle NFT drags
    if (type === 'NFT' || source.droppableId === 'nft-column') {
      const sourceIsColumn = source.droppableId === 'nft-column';
      const destRowId = destination.droppableId;
      
      // Find destination row
      const destRow = galleryRows.find(r => r.id === destRowId);
      if (!destRow || destRow.type !== 'nft') return;

      // Check if destination row is full
      if ((destRow.nftMints || []).length >= 3 && sourceIsColumn) {
        return; // Can't add more than 3 NFTs
      }

      if (sourceIsColumn) {
        // Dragging from column to row
        const nft = availableNfts[source.index];
        if (!nft) return;

        const newRows = galleryRows.map(row =>
          row.id === destRowId
            ? { ...row, nftMints: [...(row.nftMints || []), nft.id] }
            : row
        );
        setGalleryRows(newRows);
        triggerSave(newRows); // Save after adding NFT
      } else {
        // Dragging between rows or within same row
        const sourceRowId = source.droppableId;
        const sourceRow = galleryRows.find(r => r.id === sourceRowId);
        
        if (!sourceRow) return;

        const sourceMints = [...(sourceRow.nftMints || [])];
        const [movedMintId] = sourceMints.splice(source.index, 1);

        if (sourceRowId === destRowId) {
          // Reordering within same row
          sourceMints.splice(destination.index, 0, movedMintId);
          const newRows = galleryRows.map(row =>
            row.id === sourceRowId
              ? { ...row, nftMints: sourceMints }
              : row
          );
          setGalleryRows(newRows);
          triggerSave(newRows); // Save after reordering NFTs
        } else {
          // Moving between different rows
          const destMints = [...(destRow.nftMints || [])];
          
          if (destMints.length >= 3) return; // Can't add to full row
          
          destMints.splice(destination.index, 0, movedMintId);
          
          const newRows = galleryRows.map(row => {
            if (row.id === sourceRowId) {
              return { ...row, nftMints: sourceMints };
            }
            if (row.id === destRowId) {
              return { ...row, nftMints: destMints };
            }
            return row;
          });
          setGalleryRows(newRows);
          triggerSave(newRows); // Save after moving NFT between rows
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        {/* Left Column - Available NFTs */}
        <Droppable droppableId="nft-column" type="NFT">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <NftColumn
                nfts={availableNfts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Right Column - Row Builder */}
        <div className="flex-1 flex flex-col">
          {/* Save Indicator */}
          <div className="bg-neutral-200 px-4 py-2 border-b border-neutral-300">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h2 className="font-bold text-lg">Gallery Builder</h2>
              <div className="text-sm">
                {isSaving ? (
                  <span style={{ color: '#2563eb', fontWeight: '600' }}>Saving...</span>
                ) : (
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Saved</span>
                )}
              </div>
            </div>
          </div>

          <RowContainer
            rows={galleryRows}
            onAddTextRow={addTextRow}
            onAddNftRow={addNftRow}
            onUpdateTextRow={updateTextRow}
            onDeleteRow={deleteRow}
            onRemoveNftFromRow={removeNftFromRow}
            nftMap={nftMap}
          />
        </div>
      </div>
    </DragDropContext>
  );
}
