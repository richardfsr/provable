import { useEffect, useState } from "react";
import Image from "@/components/nft/image";
import Video from "@/components/nft/video";
import Html from "@/components/nft/html";
import Details from "@/components/nft/details";

export default function Nft({ metadata }) {
  const [object, setObject] = useState({});

  useEffect(() => {
    let length = metadata?.content?.files.length;
    let file = metadata?.content?.files[length - 1];
    let mimetype = file.mime.split("/")[0];
    console.log(mimetype)
    switch (mimetype) {
      case "image":
        setObject({ type: "image", file: file });
        break;
      case "video":
        setObject({ type: "video", file: file });
        break;
      case "html":
        setObject({ type: "html", file: file });
        break;
      default:
        console.log(`Couldn't display ${metadata.id} with mimetype ${mimetype}`);
    }
  }, [metadata]);

  const addDefaultSource = (e) => {
    console.log(`Can't load image for ${metadata.id}`);
  };

  return (
    <div className="sm:flex sm:gap-16 mb-8 sm:mb-24">
      <div className="w-full sm:w-2/3">
        {object && object["type"] === "image" && <Image file={object["file"]} />}
        {object && object["type"] === "video" && <Video file={object["file"]} />}
        {object && object["type"] === "html" && <Html file={object["file"]} />}
      </div>
      <div className="w-full sm:w-1/3 mt-4 sm:mt-0 overflow-hidden">
        <Details nft={metadata} />
      </div>
    </div>
  );
}
