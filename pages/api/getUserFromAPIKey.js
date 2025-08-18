import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { apiKey } = req.body;
  const user = await User.findOne({ apiKey: apiKey });
  if (user) {
    return res.status(200).json({
      user: {
        apiKey: user.apiKey,
        publicKey: user.publicKey,
        username: user.username,
      },
    });
  } else {
    return res.status(404).json({ error: "not found" });
  }
}
