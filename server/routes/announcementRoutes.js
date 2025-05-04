import express from "express";
import AnnouncementController from "../controllers/announcementController.js";

const router = express.Router();

router.post("/", AnnouncementController.create);
router.get("/", AnnouncementController.getAll);
router.get("/:id", AnnouncementController.getById);
router.put("/:id", AnnouncementController.update);
router.delete("/:id", AnnouncementController.delete);

export default router;
