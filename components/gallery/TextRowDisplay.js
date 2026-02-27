import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TextRowDisplay({ row }) {
  return (
    <div className="mb-12">
      <div className="prose prose-neutral max-w-none">
        {row.heading && (
          <h2 className="text-3xl font-bold mb-4">{row.heading}</h2>
        )}
        {row.content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
              code: ({node, inline, ...props}) => 
                inline 
                  ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
                  : <code className="block bg-gray-100 p-4 rounded my-4 overflow-x-auto" {...props} />,
            }}
          >
            {row.content}
          </ReactMarkdown>
        )}
        {!row.heading && !row.content && (
          <p className="text-gray-400 italic">Empty text row</p>
        )}
      </div>
    </div>
  );
}
