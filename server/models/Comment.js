import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true }, // The note being commented on
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who made the comment
  text: { type: String, required: true }, // Comment text
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
