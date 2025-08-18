import axios from "axios";
import apiClient from "@/utils/client/apiClient";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

export const getAssetsByOwner = async (address) => {
  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_SERVER).use(dasApi());
  const owner = publicKey(address);

  // Fetch all digital assets
  var page = 1;
  var items = [];
  while (true) {
    try {
      const resp = await umi.rpc.getAssetsByOwner({
        owner,
        limit: 1000,
        page: page
      });
      page += 1;
      items.push(resp.items);
      if (resp.items.length < 1000) break;
    } catch (err) {
      console.log(err);
      break;
    }
  }

  items = items.flat().filter((i) => i.compression?.compressed !== true);

  var results = [];

  try {
    // filter using the solflare blocklist
    let response = await axios.get(
      "https://raw.githubusercontent.com/solflare-wallet/blocklist-automation/master/dist/blocklist.json"
    );
    let blocked = response.data.blocklist;

    blocked.push(
      "rayds.pro",
      "raydi.io",
      "raydi.promo",
      "jupgem.com",
      "juptreasure.com",
      "myrovoucher.com",
      "tensor.credit",
      "magiceden.club"
    );

    for (const i of items) {
      if (i.content.files.length === 0) continue;

      if (!i.content.links.external_url || i.content.links.external_url === "") {
        results.push(i);
        continue;
      }

      try {
        let url = new URL(i.content.links.external_url);
        if (blocked.includes(url.hostname)) continue;
      } catch (err) {
        console.log(err);
        continue;
      }

      results.push(i);
    }
  } catch (err) {
    console.log(err);
  }

  // sort visible and hidden based on the users mintlist
  try {
    let mintRes = await apiClient.post("/getGalleryMintlist", { address: address });
    var mints = mintRes.data.mints;
  } catch (err) {
    console.log(err);
  }

  if (mints && mints.length > 0) {
    let resVisible = [];
    let resHidden = [];
    // Find tokens for mints in the gallery
    for (const m of mints) resVisible.push(results.find((r) => r.id === m));
    // Get all the other tokens and put them in hidden
    for (const r of results) {
      if (!mints.find((m) => r.id === m)) resHidden.push(r);
    }
    return [resVisible, resHidden];
  } else {
    return [results, []];
  }
};
