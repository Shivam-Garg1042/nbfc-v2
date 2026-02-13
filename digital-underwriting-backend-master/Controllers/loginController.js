import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomError from "../customError.js";
import userModel from "../MongoDB/userModel.js";

export default async function loginController({ email, password }, response) {
  try {
    // 1. Check user exists ot not.
    console.log("Login attempt for:", email);
    const res = await userModel.findOne({ email }).populate("role");
    console.log("User found:", res ? "Yes" : "No");
    if (res) {
      console.log("User data:", { name: res.name, email: res.email, hasPassword: !!res.password, role: res.role });
    }
    if (!res) throw new CustomError("User does not exist.", 404);

    // 2. Check if the password is correct.
    const isMatch = await bcrypt.compare(password, res.password);
    console.log("Password match:", isMatch);
    if (!isMatch) throw new CustomError("Wrong credentials", 400);

    // 3. If both are correct then issue a JSON token.
    if (res && isMatch) {
      const payload = {
        name: res.name,
        email: res.email,
        role: res.role,
        organization: res.organization,
      };
      const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secret, { expiresIn: "1095d" }); // 3 years (1095 days)

      response.cookie("jwt", token, {
        httpOnly: false,
        maxAge: 3 * 365 * 24 * 60 * 60 * 1000, // 3 years in milliseconds
        path: "/",
        secure: true, // Required for cross-origin cookies
        sameSite: 'none', // Allow cross-origin cookies
      });

      return { status: 200, data: payload, error: null };
    }
  } catch (err) {
    console.error("Login error:", err.message, err.stack);
    if (err instanceof CustomError) {
      return {
        status: err?.status,
        error: {
          status: err?.status || 401,
          message: err?.message || "Bad Request",
        },
        data: null,
      };
    }

    return {
      status: 500,
      error: { status: 500, message: "Internal server error" },
      data: null,
    };
  }
}
