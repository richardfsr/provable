export default function EmptyState({ onAddTextRow, onAddNftRow }) {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center px-4 max-w-md">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Build Your Gallery</h2>
        <p className="text-gray-600 mb-8">
          Create a beautiful story with your NFTs!<br/>
          Drag NFTs from the left and add text to showcase your collection.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onAddTextRow}
            className="py-3 px-6 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
          >
            + Add Text Row
          </button>
          <button
            onClick={onAddNftRow}
            className="py-3 px-6 bg-neutral-700 text-white font-bold hover:bg-neutral-600 transition-colors"
          >
            + Add NFT Row
          </button>
        </div>
      </div>
    </div>
  );
}
