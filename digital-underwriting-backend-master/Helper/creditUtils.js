import jwt from "jsonwebtoken";
import userModel from "../MongoDB/userModel.js";
import creditTransactionModel from "../MongoDB/creditTransactionModel.js";

export const CREDIT_THRESHOLD = 200;

export const CREDIT_COSTS = {
  risk: 10,
  vehicle: 20,
  credit: 50,
};

export const getAuthPayload = (req) => {
  if (req?.auth) {
    return req.auth;
  }

  const token = req.cookies?.jwt;
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export const getRoleName = (payload) => payload?.role?.role || payload?.role || "";

export const chargeCredits = async ({ req, action, cost, threshold = CREDIT_THRESHOLD }) => {
  const payload = getAuthPayload(req);

  if (!payload?.email) {
    return { ok: false, status: 401, error: "Authentication required" };
  }

  const defaultCredits = 2000;

  const existingUser = await userModel.findOne({ email: payload.email });
  if (!existingUser) {
    return { ok: false, status: 404, error: "User not found" };
  }

  const numericCredits = Number(existingUser.credits);
  if (!Number.isFinite(numericCredits)) {
    existingUser.credits = defaultCredits;
    await existingUser.save();
  } else if (typeof existingUser.credits !== "number") {
    existingUser.credits = numericCredits;
    await existingUser.save();
  }

  if (existingUser.credits < 0) {
    existingUser.credits = defaultCredits;
    await existingUser.save();
  }

  const minimumRequired = Math.max(cost, threshold);

  if (existingUser.credits < minimumRequired) {
    return {
      ok: false,
      status: 402,
      error: "Low credits. Please recharge.",
      credits: existingUser.credits,
    };
  }

  const user = await userModel.findByIdAndUpdate(
    existingUser._id,
    { $inc: { credits: -cost } },
    { new: true }
  );

  if (!user) {
    return {
      ok: false,
      status: 402,
      error: "Low credits. Please recharge.",
      credits: existingUser.credits,
    };
  }

  await creditTransactionModel.create({
    userId: user._id,
    action,
    delta: -cost,
    balanceAfter: user.credits,
  });

  return { ok: true, status: 200, user, balance: user.credits };
};

export const addCreditsByEmail = async ({ email, amount, action = "admin_recharge" }) => {
  const user = await userModel.findOneAndUpdate(
    { email },
    { $inc: { credits: amount } },
    { new: true }
  );

  if (!user) {
    return { ok: false, status: 404, error: "User not found" };
  }

  await creditTransactionModel.create({
    userId: user._id,
    action,
    delta: amount,
    balanceAfter: user.credits,
  });

  return { ok: true, status: 200, user, balance: user.credits };
};
