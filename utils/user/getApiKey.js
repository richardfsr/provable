import bs58 from "bs58";
import apiClient from "@/utils/client/apiClient";

async function getApiKey(publicKey, signMessage) {
  let message = await getSignInToken(publicKey.toBase58());
  if (typeof message === "string") {
    let signature = await sign(
      signMessage,
      `Please sign this message to log-in: ${message}`
    );
    let res = await createApiKey(publicKey.toBase58(), bs58.encode(signature));
    return res;
  }
}

async function sign(signMessage, message) {
  let res = await signMessage(Buffer.from(message));
  return res;
}

async function createApiKey(publicKey, signature) {
  const res = await apiClient.post("/signIn", { signature: signature, publicKey: publicKey });
  return res.data;
}

async function getSignInToken(publicKey) {
  const res = await apiClient.post("/getSignInToken", { publicKey: publicKey });
  return res.data.message;
}

export default getApiKey;
