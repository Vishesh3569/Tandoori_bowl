import { Router } from "express";
import { createOrder, verifyPayment, getMyOrders } from "../controllers/orderController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/my-orders", verifyToken, getMyOrders);

export default router;