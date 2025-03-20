import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    profilePic: { type: String, default: "" },
    savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    uploadedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    badges: [{ type: String }],
    status: { type: String, enum: ["deleted", "banned", "active"], default: "active"}
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
