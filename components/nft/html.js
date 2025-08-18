export default function Html({ file }) {
  return (
    <>
      {file && (
        <div className="w-full bg-neutral-200">
          <iframe
            src={file.cdn_uri ? file.cdn_uri : file.uri}
            className="w-full h-full"
          />
        </div>
      )}
    </>
  );
}
