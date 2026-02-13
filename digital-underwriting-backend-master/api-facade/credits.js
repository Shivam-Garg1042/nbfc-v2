import express from "express";
import bothProtect from "../Controllers/protectController.js";
import creditTransactionModel from "../MongoDB/creditTransactionModel.js";
import userModel from "../MongoDB/userModel.js";
import { addCreditsByEmail, getAuthPayload, getRoleName } from "../Helper/creditUtils.js";

const router = express.Router();

const DAY_MS = 24 * 60 * 60 * 1000;

router.get("/history", async (req, res) => {
  try {
    const payload = getAuthPayload(req);

    if (!payload?.email) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = await userModel.findOne({ email: payload.email }).select("_id credits");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const limit = Math.min(parseInt(req.query.limit || "20", 10) || 20, 100);
    const offset = parseInt(req.query.offset || "0", 10) || 0;
    const since = new Date(Date.now() - 90 * DAY_MS);

    const [items, total] = await Promise.all([
      creditTransactionModel
        .find({ userId: user._id, createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),
      creditTransactionModel.countDocuments({ userId: user._id, createdAt: { $gte: since } }),
    ]);

    return res.json({
      success: true,
      data: {
        items,
        total,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Credits history error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.post("/admin/recharge", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
        errorCode: auth.status,
      });
    }

    const payload = getAuthPayload(req);
    const roleName = getRoleName(payload);
    if (roleName !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    const { email, amount } = req.body;
    const parsedAmount = Number(amount);

    if (!email || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid email and amount are required",
      });
    }

    const result = await addCreditsByEmail({ email, amount: parsedAmount });
    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        error: result.error,
        errorCode: result.status,
      });
    }

    return res.json({
      success: true,
      data: {
        email,
        credits: result.balance,
      },
    });
  } catch (error) {
    console.error("Admin recharge error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
