import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { address } = req.body;
  const user = await User.findOne({ publicKey: address });
  if (!user) return res.status(404);

  return res.status(200).json({
    mints: user.mints,
  });
}
