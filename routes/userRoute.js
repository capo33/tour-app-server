import express from "express";
const router = express.Router();

import { signup, signin, googleLogin } from "../controllers/userController.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/googleLogin", googleLogin);

export default router;
