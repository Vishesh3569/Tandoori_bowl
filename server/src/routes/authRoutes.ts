import { Router } from "express";
import { requestOTP, verifyOTP } from "../controllers/authController";

const router = Router();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

export default router;