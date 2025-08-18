import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { publicKey } = req.body;
  const uuid = crypto.randomUUID();

  try {
    await User.findOneAndUpdate(
      { publicKey: publicKey },
      { signInMessage: uuid },
      { upsert: true }
    );
    return res.status(200).json({ message: uuid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
