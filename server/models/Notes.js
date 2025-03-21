import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    gapis_file_id: { type: String, unique: true },
    supabase_path: { type: Object },
    url: {type: String},
    title: { type: String, required: true },
    content: { type: String, required: true },
    verified: { type: Boolean, default: false },
    document_type: { type: String, required: true },
    semester:{type: Number},
    subject: { type: String },
    subject_code: { type: String },
    branch: { type: String },
    college: { type: String },
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
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);
export default Note;
