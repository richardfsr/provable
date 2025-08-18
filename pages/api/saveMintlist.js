import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { apiKey, mints } = req.body;

  const exists = await User.exists({
    apiKey: apiKey,
  });
  if (!exists) return res.status(400).json({ error: "User not found" });

  await User.updateOne({ apiKey: apiKey }, { mints: mints });

  return res.status(200).json({
    message: "ok",
  });
}
