import Note from "../models/Notes.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

class NotesController {
    // ✅ Test Route
    static hello = async (req, res) => {
        res.send("Hello, this is the Exclutch Notes API!");
    };

    // ✅ Create a Note (Authenticated users only)
    static createNote = async (req, res) => {
        try {
            const { gapis_file_id, title, content, document_type, subject, subject_code, branch, college, authorId } = req.body;

            const user = await User.findOne({ uid: authorId });
            if (!user) return res.status(404).json({ error: "User not found" });

            const newNote = new Note({
                gapis_file_id,
                title,
                content,
                document_type,
                subject,
                subject_code,
                branch,
                college,
                author: user._id
            });

            const savedNote = await newNote.save();
            res.status(201).json({ message: "Note uploaded successfully!", data: savedNote });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Get All Notes (Public)
    static getAllNotes = async (req, res) => {
        try {
            const notes = await Note.find().populate("author", "name email profilePic");
            res.json({ message: "Notes retrieved successfully", data: notes });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Get Single Note (Public, Increases View Count)
    static getNoteById = async (req, res) => {
        try {
            const { noteId } = req.params;
            const note = await Note.findById(noteId).populate("author", "name email profilePic");

            if (!note) return res.status(404).json({ error: "Note not found" });

            // Increment view count
            note.viewCount += 1;
            await note.save();

            res.json({ message: "Note retrieved successfully", data: note });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Approve a Note (Admin only)
    static approveNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const { userRole } = req.body; // Ensure admin check

            if (userRole !== "admin") return res.status(403).json({ error: "Unauthorized! Admin access required" });

            const note = await Note.findByIdAndUpdate(noteId, { verified: true }, { new: true });

            if (!note) return res.status(404).json({ error: "Note not found" });

            res.json({ message: "Note approved successfully!", data: note });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Like/Unlike a Note (Authenticated users only)
    static likeNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const { userId } = req.body;

            const note = await Note.findById(noteId);
            if (!note) return res.status(404).json({ error: "Note not found" });

            const user = await User.findOne({ uid: userId });
            if (!user) return res.status(404).json({ error: "User not found" });

            // Toggle Like/Unlike
            if (note.likeCount.includes(user._id)) {
                note.likeCount.pull(user._id);
            } else {
                note.likeCount.push(user._id);
            }
            await note.save();

            res.json({ message: "Like status updated", data: note });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Comment on a Note (Authenticated users only)
    static addComment = async (req, res) => {
        try {
            const { noteId } = req.params;
            const { userId, text } = req.body;

            const user = await User.findOne({ uid: userId });
            if (!user) return res.status(404).json({ error: "User not found" });

            const note = await Note.findById(noteId);
            if (!note) return res.status(404).json({ error: "Note not found" });

            const newComment = new Comment({
                user: user._id,
                note: note._id,
                text
            });

            const savedComment = await newComment.save();
            note.comments.push(savedComment._id);
            await note.save();

            res.json({ message: "Comment added successfully!", data: savedComment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // ✅ Delete a Note (Admin only)
    static deleteNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const { userRole } = req.body; // Ensure admin check

            if (userRole !== "admin") return res.status(403).json({ error: "Unauthorized! Admin access required" });

            const note = await Note.findByIdAndDelete(noteId);

            if (!note) return res.status(404).json({ error: "Note not found" });

            res.json({ message: "Note deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default NotesController;
