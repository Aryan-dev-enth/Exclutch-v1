import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  gapis_file_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  verified: { type: Boolean, default: false }, 
  document_type: { type: String, required: true },
  subject: { type: String, required: true },
  subject_code: { type: String, required: true },
  branch: { type: String, required: true },
  college: { type: String, required: true },
  author: { type: String },
  likeCount: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downloadsCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tags: [{ type: String }], // NEW
  pinned: { type: Boolean, default: false }, // NEW
  trending: { type: Boolean, default: false }, // NEW
  published: { type: Date, default: Date.now },
}, { timestamps: true });

const Note = mongoose.model("Note", NoteSchema);
export default Note;
