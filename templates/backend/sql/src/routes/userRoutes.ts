import { Router } from "express";
import { signup } from "../controllers/userController.ts";

const router = Router();

router.post("/signup", signup);

export default router;
