export default function Video({ file }) {
  return (
    <>
      {file && (
        <div className="w-full min-h-48 bg-neutral-100">
          <video
            autoPlay
            muted
            loop
            playsInline
            src={file.cdn_uri ? file.cdn_uri : file.uri}
          />
        </div>
      )}
    </>
  );
}
