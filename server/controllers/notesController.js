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
            const { supabase_path, url, title, content, document_type, subject, subject_code, branch, college} = req.body;

            const {userId} = req.params;
            const user = await User.findOne({uid: userId});
            if (!user) return res.status(404).json({ error: "User not found" });

            const newNote = new Note({
                supabase_path,
                url,
                title: title,
                content: content,
                document_type: document_type,
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
            const { userId } = req.params;
            
    
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
    
            // Fetch user role from database
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            let notes;
            if (user.role === "admin") {
                // Admin can see all notes
                notes = await Note.find().populate("author", "name email profilePic");
            } else {
                // Non-admin users can only see verified notes
                notes = await Note.find({ verified: true }).populate("author", "name email profilePic");
            }
    
            res.json({ message: "Notes retrieved successfully", data: notes });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    

    // ✅ Get Single Note (Public, Increases View Count)
    static getNoteById = async (req, res) => {
        try {
            const { noteId } = req.params;
            const note = await Note.findById(noteId)
            .populate("author", "name email profilePic") 
            .populate({
                path: "comments", 
                populate: { path: "user", select: "name email profilePic" } 
            });

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
            const { userId } = req.body; 

            const user = await User.findById(userId);
            if(!user) return res.status(404).json({ error: "User not found" });

            if (user.role !== "admin") return res.status(403).json({ error: "Unauthorized! Admin access required" });

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

            const user = await User.findOne({uid: userId});
            if (!user) return res.status(404).json({ error: "User not found" });

            // Toggle Like/Unlike
            if (note.likes.includes(user._id)) {
                note.likes.pull(user._id);
            } else {
                
                note.likes.push(user._id);
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

    // ✅ Update a Note by ID (Admin only)
static updateNoteById = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { userId, ...updateFields } = req.body;
        

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized! Admin access required" });
        }

        const updatedNote = await Note.findByIdAndUpdate(noteId, updateFields, { new: true });
        console.log(updatedNote)
        if (!updatedNote) return res.status(404).json({ error: "Note not found" });

        res.json({ message: "Note updated successfully!", data: updatedNote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

    

    // ✅ Delete a Note (Admin only)
    static deleteNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const { userId } = req.body;
            
            
            const user = await User.findById(userId);
            if(!user) return res.status(404).json({ error: "User not found" });

            if (user.role !== "admin") return res.status(403).json({ error: "Unauthorized! Admin access required" });

            const note = await Note.findByIdAndDelete(noteId);
            

            if (!note) return res.status(404).json({ error: "Note not found" });

            res.json({ message: "Note deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default NotesController;
