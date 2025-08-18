import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  await connectDB();

  const { apiKey, username } = req.body;
  const validUsername = /^[0-9A-Za-z]{3,16}$/;
  if (!validUsername.test(username))
    return res
      .status(400)
      .json({ error: "username can only contain letters and numbers and must be between 3-16 characters long" });

  const exists = await User.exists({
    username: username.toLowerCase(),
  });
  if (exists)
    return res.status(400).json({ error: "username is already taken" });

  await User.updateOne(
    { apiKey: apiKey },
    { username: username.toLowerCase() }
  );
  const user = await User.findOne({ apiKey: apiKey });

  return res.status(200).json({
    user: {
      apiKey: user.apiKey,
      publicKey: user.publicKey,
      username: user.username,
    },
  });
}
