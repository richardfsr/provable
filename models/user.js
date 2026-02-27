import mongoose from "mongoose";

const GalleryRowSchema = new mongoose.Schema({
  id: String,
  type: String,
  order: Number,
  heading: String,
  content: String,
  nftMints: [String]
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    publicKey: String,
    signInMessage: String,
    username: String,
    apiKey: String,
    galleryRows: {
      type: [GalleryRowSchema],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
