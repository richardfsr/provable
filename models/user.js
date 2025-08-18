import mongoose from "mongoose";

const User = mongoose.Schema(
  {
    publicKey: String,
    signInMessage: String,
    username: String,
    apiKey: String,
    mints: Array,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", User);
