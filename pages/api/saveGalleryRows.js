import User from "@/models/user";
import connectDB from "@/lib/connectDB";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const { apiKey, galleryRows } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "API key required" });
  }

  try {
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate galleryRows structure
    if (galleryRows && Array.isArray(galleryRows)) {
      for (const row of galleryRows) {
        if (!row.id || !row.type) {
          return res.status(400).json({ error: "Invalid row structure" });
        }
        if (row.type === 'nft' && row.nftMints && row.nftMints.length > 3) {
          return res.status(400).json({ error: "Max 3 NFTs per row" });
        }
      }
    }

    user.galleryRows = galleryRows || [];
    
    console.log('Saving to database:', JSON.stringify(user.galleryRows, null, 2));
    
    await user.save();

    return res.status(200).json({ success: true, message: "Gallery saved" });
  } catch (error) {
    console.error("Error saving gallery rows:", error);
    return res.status(500).json({ error: error.message });
  }
}
