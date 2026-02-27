import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TextRow({ row, dragHandleProps, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(!row.heading && !row.content);
  const [heading, setHeading] = useState(row.heading || "");
  const [content, setContent] = useState(row.content || "");

  const handleSave = () => {
    onUpdate(row.id, { heading, content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to saved values
    setHeading(row.heading || "");
    setContent(row.content || "");
    setIsEditing(false);
  };

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
          <span className="text-sm font-medium text-gray-700">Text Row</span>
        </div>
        <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  padding: '4px 12px',
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: '#16a34a',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '4px 12px',
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '4px 12px',
                fontSize: '14px',
                color: 'white',
                backgroundColor: '#000000',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            style={{
              padding: '4px 12px',
              fontSize: '14px',
              color: 'white',
              backgroundColor: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '2px'
            }}
            title="Delete row"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Heading (optional)"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-3 py-2 text-2xl font-bold border border-neutral-300 focus:outline-none focus:border-black"
            />
            <textarea
              placeholder="Enter your content here... (Markdown supported: **bold**, *italic*, [links](url), lists, etc.)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-sm resize-y"
            />
            <div className="text-xs text-gray-500">
              Supports Markdown: **bold**, *italic*, [links](url), lists, tables, code blocks
            </div>
          </div>
        ) : (
          <div className="prose prose-neutral max-w-none">
            {heading && <h2 className="text-2xl font-bold mb-4">{heading}</h2>}
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">No content yet. Click Edit to add text.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
