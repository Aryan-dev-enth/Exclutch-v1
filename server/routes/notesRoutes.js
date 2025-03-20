import express from "express";
import NotesController from "../controllers/notesController.js";

const router = express.Router();


router.get("/test", NotesController.hello);
router.post("/create", NotesController.createNote);
router.get("/getAll/:userId", NotesController.getAllNotes);
router.get("/:noteId", NotesController.getNoteById);
router.put("/:noteId/approve", NotesController.approveNote);
router.put("/:noteId/like", NotesController.likeNote);
router.post("/:noteId/comment", NotesController.addComment);
router.delete("/:noteId", NotesController.deleteNote);

export default router;
