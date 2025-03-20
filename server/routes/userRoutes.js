import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

// Public Routes
router.get("/hello", UserController.hello); // Test route
router.post("/register", UserController.register);
router.get("/:uid", UserController.getUserById);
router.get("/", UserController.getUsers);
router.put("/:uid", UserController.updateUser);
router.put("/:uid/role", UserController.changeRole);
router.put("/:uid/status", UserController.changeStatus);

export default router;
