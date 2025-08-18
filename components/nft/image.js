import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Image({ file }) {
  return (
    <>
      {file && (
        <div className="w-full">
          <LazyLoadImage
            src={file.cdn_uri ? file.cdn_uri : file.uri}
            className="w-full"
          />
        </div>
      )}
    </>
  );
}
