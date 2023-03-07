import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWallet from "/components/wallet/ConnectWallet";

import {
  Metaplex,
  walletAdapterIdentity,
  toMetaplexFileFromBrowser,
} from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";

export default function Home() {
  const wallet = useWallet();
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [isMinting, setIsMinting] = useState(false);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  function onImageChange(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  const mintNFT = async () => {
    setIsMinting(true);
    toast("Uploading your file to Arweave");
    const img = await toMetaplexFileFromBrowser(file);
    const imgUrl = await metaplex.storage().upload(img);
    console.log(imgUrl);
    toast("Creating json metadata on Arweave");
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      image: imgUrl,
      properties: {
        files: [
          {
            type: "image/png",
            uri: imgUrl,
          },
        ],
      },
    });
    toast("Minting your NFT");
    const { nft } = await metaplex.nfts().create({
      uri: uri,
      name: document.getElementById("name").value,
      sellerFeeBasisPoints: document.getElementById("royalty").value * 100,
    });
    setIsMinting(false);
    toast.success(`🎉 Congratulations you minted ${nft.name}`);
  };

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="p-4 max-w-6xl mx-auto font-mono">
        <nav>
          <div className="float-left w-fit">
            <h1 className="mt-2 font-extrabold text-2xl">Provable</h1>
          </div>
          <div className="float-right w-fit">
            <ConnectWallet />
          </div>
        </nav>
        <div className="clear-both"></div>
        <div className="w-full border-b border-gray-200 mt-4"></div>
        <main className="grid grid-cols-2 gap-10 my-8">
          {wallet && wallet.publicKey ? (
            <>
              <div className="">
                <h2 className="mt-2 font-bold text-xl text-gray-800">Step 1</h2>
                <input
                  className="mt-4"
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                />
                {image && (
                  <>
                    <div className="mt-8">
                      <h2 className="font-bold text-xl text-gray-800">
                        Step 2
                      </h2>
                      <div className="mt-6">
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          name
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          description
                        </label>
                        <div className="mt-2.5">
                          <textarea
                            type="text"
                            name="description"
                            id="description"
                            className="block w-full h-24 rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          ></textarea>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="url"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          external url
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="url"
                            id="url"
                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="url"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          royalty percentage
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="number"
                            max="100"
                            min="0"
                            name="royalty"
                            id="royalty"
                            defaultValue="0"
                            className="block w-fit rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      {isMinting ? (
                        <div className="mt-4">
                          <Oval
                            color="#fff"
                            secondaryColor="#000"
                            height={30}
                            width={30}
                            className="p-0 m-0"
                          />
                        </div>
                      ) : (
                        <button
                          type="submit"
                          className="mt-4 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => mintNFT()}
                        >
                          Mint
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="border-l border-gray-200 px-12">
                <h2 className="mt-2 font-bold text-xl text-gray-800">
                  Preview
                </h2>
                {image && <img className="mt-4" src={image} />}
              </div>
            </>
          ) : (
            <p>Connect your wallet to start</p>
          )}
        </main>
      </div>
    </>
  );
}
