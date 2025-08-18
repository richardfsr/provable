import { useEffect, useState } from "react";
import Link from "next/link";
import Artists from "@/data/artists.json";

export default function Details({ nft }) {
  const [artist, setArtist] = useState();

  useEffect(() => {
    let result = Artists.find((a) => a.public_key === nft?.creators[0]?.address);
    if (result) setArtist(result);
  }, [nft]);

  return (
    <div>
      <div className="mt-4 mb-4">
        <h1 className="mb-4">{nft?.content?.metadata?.name}</h1>
        <p className="text-sm">{nft?.content?.metadata?.description}</p>
      </div>
      {artist && (
        <p className="font-bold">{artist.name}</p>
      )}
      <div className="mt-8 text-sm">
        <p className="my-1 truncate">Metadata:  <Link className="text-blue-600" href={nft?.content?.json_uri} target="_blank">{nft?.content?.json_uri}</Link></p>
        <p className="my-1 truncate">Original:  <Link className="text-blue-600" href={nft?.content?.files[nft?.content?.files.length - 1].uri} target="_blank">View original</Link></p>
      </div>
    </div>
  );
}
