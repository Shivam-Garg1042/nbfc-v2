import jwt from "jsonwebtoken";
import userModel from "../MongoDB/userModel.js";
import CustomError from "../customError.js";

function isAuthenticatedController(token) {
  try {
    // 1. Verify the JWT, if expired or manipulated.
    const payload = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);

    if (!payload) throw new CustomError("Unauthenticated", 403);

    // 2. Check if the user exists or not.
    const userExist = userModel.findOne({ email: payload.email });
    if (!userExist) throw new CustomError("User does not exist", 403);

    return { status: 200, message: "User is authenticated and still exist.", payload };
  } catch (err) {
    if (err instanceof CustomError) {
    return { status: err?.status, message: err?.message };
    }

    return { status: 400, message: "Bad Request" };
  }
}
function isAuthorizedController(payload, tabKey) {
  // 2. Check user is authorized ?
  if (payload?.role?.permissions?.includes(tabKey))
    return { status: 200, message: "User is authorized for this tab." };
  else return { status: 403, message: "Unauthorized" };
}

export default function bothProtect(req, tabKey) {
  const token = req.cookies.jwt;
  
  console.log(`🔐 bothProtect called for tab: ${tabKey}`);
  console.log(`🍪 Token present: ${!!token}`);

  if (!token) {
    console.log('❌ No token found');
    return {
      status: 403,
      error: { status: 403, message: "Unauthorized - No token" },
      data: null,
    };
  }

  const protectAuthenticated = isAuthenticatedController(token);
  console.log(`✅ Authentication check: ${protectAuthenticated.status} - ${protectAuthenticated.message}`);

  if (protectAuthenticated.status !== 200) {
    return {
      status: protectAuthenticated.status,
      error: {
        status: protectAuthenticated.status,
        message: protectAuthenticated.message,
      },
      data: null,
    };
  }

  const payload = protectAuthenticated.payload;
  req.auth = payload;

  const protectAuthorized = isAuthorizedController(payload, tabKey);
  console.log(`🔑 Authorization check for ${tabKey}: ${protectAuthorized?.status} - ${protectAuthorized?.message}`);

  if (protectAuthorized?.status !== 200) {
    console.log(`❌ User permissions:`, payload?.role?.permissions);
    console.log(`❌ Required permission: ${tabKey}`);
    return {
      status: protectAuthorized.status,
      error: {
        status: protectAuthorized.status,
        message: protectAuthorized.message,
      },
      data: null,
    };
  } else {
    console.log(`✅ Authorization passed for ${tabKey}`);
    return {
      status: 200,
    };
  }
  //  return {
  //   status: 200,
  //   message: "Authentication bypassed for testing"
  // };
}
