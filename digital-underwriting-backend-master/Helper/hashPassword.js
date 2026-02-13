import bcrypt from "bcryptjs";

export default async function hashPassword(val) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(val, saltRounds);

  return hashedPassword;
}
