import axios from "axios";
import apiClient from "@/utils/client/apiClient";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

export const getAssetsByOwner = async (address) => {
  try {
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
        console.log("Error fetching page:", err);
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
        if (!i.content?.files || i.content.files.length === 0) continue;

        const externalUrl = i.content?.links?.external_url;
        if (!externalUrl || externalUrl === "") {
          results.push(i);
          continue;
        }

        try {
          let url = new URL(externalUrl);
          if (blocked.includes(url.hostname)) continue;
        } catch (err) {
          // Invalid URL format, skip filtering and include the NFT
          results.push(i);
          continue;
        }

        results.push(i);
      }
    } catch (err) {
      console.log("Error filtering NFTs:", err);
      // If filtering fails, return all items
      return items.filter(i => i.content?.files && i.content.files.length > 0);
    }

    return results;
  } catch (err) {
    console.error("Fatal error in getAssetsByOwner:", err);
    return [];
  }
};
