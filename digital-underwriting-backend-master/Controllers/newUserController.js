import CustomError from "../customError.js";
import emailBody from "../Helper/emailBody.js";
import hashPassword from "../Helper/hashPassword.js";
import roleModel from "../MongoDB/roleModel.js";
import userModel from "../MongoDB/userModel.js";

export default async function newUserController(input) {
  try {
    console.log(input);
    const role = await roleModel.findOne({ role: input.role.toLowerCase() });
    if (!role) throw new CustomError("This role does not exist currently", 400);

    const hashedPassword = await hashPassword(input.password);

    const user = new userModel({
      ...input,
      password: hashedPassword,
      role: role.id,
    });
    const savedUser = await user.save();

    // await emailBody({
    //   email: input.email,
    //   password: input.password,
    //   name: input.name,
    // });

    return { status: 200, data: savedUser, error: null };
  } catch (err) {
    if (err.name === "ValidationError") {
      return {
        status: 400,
        error: { status: 400, message: "Internal server error" },
        data: null,
      };
    }
    if (err.code === 11000) {
      return {
        status: 11000,
        error: { status: 11000, message: "This email Id already exist." },
        data: null,
      };
    }

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
