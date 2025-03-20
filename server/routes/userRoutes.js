import express from 'express';
import UserController from "../controllers/userController.js";

const router = express.Router();

router.get("/", UserController.hello)
router.post("/register", UserController.register);

export default router;