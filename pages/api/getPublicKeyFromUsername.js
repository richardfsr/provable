import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { username } = req.body;
  const user = await User.findOne({
    username: username.toLowerCase(),
  });
  if (!user) return res.status(404);

  return res.status(200).json({ publicKey: user.publicKey });
}
