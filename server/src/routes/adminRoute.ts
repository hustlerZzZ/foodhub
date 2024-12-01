import express from "express";
import { getAllAdmin, signIn, signUp } from "../controller/adminController";
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-all-admin", getAllAdmin);

export default router;
