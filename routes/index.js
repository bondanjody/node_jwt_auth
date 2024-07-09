import express from "express";
import { getUsers, registerUser, loginUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.post('/users', registerUser)
router.post('/login', loginUser)

export default router