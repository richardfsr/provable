import nacl from "tweetnacl";
import bs58 from "bs58";
import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { publicKey, signature } = req.body;
  const user = await User.findOne({ publicKey: publicKey });
  if (!user) return res.status(404);
  try {
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(
        `Please sign this message to log-in: ${user.signInMessage}`
      ),
      bs58.decode(signature),
      bs58.decode(publicKey)
    );
    if (!verified) return res.status(401);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  const uuid = crypto.randomUUID();
  try {
    await User.updateOne({ publicKey: publicKey }, { apiKey: uuid });
    return res.status(200).json({
      user: {
        apiKey: uuid,
        publicKey: user.publicKey,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
