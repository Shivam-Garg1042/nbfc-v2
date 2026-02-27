import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import bothProtect from "../Controllers/protectController.js";
import userModel from "../MongoDB/userModel.js";
import roleModel from "../MongoDB/roleModel.js";
import userDriverMappingModel from "../MongoDB/userDriverMappingModel.js";
import hashPassword from "../Helper/hashPassword.js";
import { getAuthPayload, getRoleName } from "../Helper/creditUtils.js";

const router = express.Router();

const normalizeString = (value) => (value || "").trim();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateTempPassword = () =>
  crypto.randomBytes(8).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);

const buildUserResponse = (user) => ({
  userId: user?._id?.toString(),
  name: user?.name || "",
  email: user?.email || "",
  organization: user?.organization || "",
  role: user?.role?.role || user?.role || "",
  batteries: user?.batteries ?? 0,
  version: user?.version || "Lite",
  verificationAccess: user?.verificationAccess !== false,
});

const resolveUserByIdentifier = async (identifier) => {
  if (!identifier) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await userModel.findById(identifier).populate("role");
    if (byId) {
      return byId;
    }
  }

  return userModel.findOne({ email: identifier }).populate("role");
};

const getRolePolicy = (roleName, organization) => {
  const normalizedRole = (roleName || "").toLowerCase();
  const normalizedOrg = (organization || "").toLowerCase();

  if (normalizedRole === "nbfc") {
    return {
      canCreate: true,
      allowedRoles: ["employee"],
      mustMatchOrg: true,
      normalizedOrg,
    };
  }

  if (normalizedRole === "admin") {
    const allowedRoles = normalizedOrg === "chargeup"
      ? ["admin", "employee"]
      : ["nbfc", "employee"];

    return {
      canCreate: true,
      allowedRoles,
      mustMatchOrg: false,
      normalizedOrg,
    };
  }

  return {
    canCreate: false,
    allowedRoles: [],
    mustMatchOrg: false,
    normalizedOrg,
  };
};

// List users
router.get("/list", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization);

    const query = roleName === "nbfc" && orgFilter
      ? { organization: new RegExp(`^${escapeRegExp(orgFilter)}$`, "i") }
      : {};

    let users = await userModel.find(query).populate("role");

    if (roleName !== "admin") {
      users = users.filter((user) => user?.role?.role !== "admin");
    }

    return res.json({
      success: true,
      data: users.map(buildUserResponse),
    });
  } catch (error) {
    console.error("User list error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Create user
router.post("/create", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const creatorRole = (getRoleName(payload) || "").toLowerCase();
    const creatorOrg = normalizeString(payload?.organization);

    const name = normalizeString(req.body?.name);
    const email = normalizeString(req.body?.email).toLowerCase();
    const organization = normalizeString(req.body?.organization);
    const requestedRole = normalizeString(req.body?.role).toLowerCase();
    const verificationAccess = req.body?.verificationAccess !== false;

    if (!name || !email || !organization || !requestedRole) {
      return res.status(400).json({
        success: false,
        error: "Name, email, organization, and role are required",
      });
    }

    const policy = getRolePolicy(creatorRole, organization);
    if (!policy.canCreate) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (policy.mustMatchOrg && creatorOrg && creatorOrg.toLowerCase() !== organization.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: "Organization mismatch",
      });
    }

    if (!policy.allowedRoles.includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role for this organization",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already created",
      });
    }

    const roleDoc = await roleModel.findOne({ role: requestedRole });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        error: "Role does not exist",
      });
    }

    const rawPassword = normalizeString(req.body?.password) || generateTempPassword();
    const hashedPassword = await hashPassword(rawPassword);

    const createdUser = await userModel.create({
      name,
      email,
      organization,
      role: roleDoc._id,
      password: hashedPassword,
      verificationAccess,
    });

    const populatedUser = await userModel.findById(createdUser._id).populate("role");

    return res.json({
      success: true,
      data: {
        ...buildUserResponse(populatedUser),
        tempPassword: normalizeString(req.body?.password) ? undefined : rawPassword,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get user by id/email
router.get("/:id", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization).toLowerCase();

    const user = await resolveUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (roleName !== "admin" && user?.role?.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (roleName === "nbfc" && orgFilter && user.organization?.toLowerCase() !== orgFilter) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    return res.json({
      success: true,
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization).toLowerCase();

    const user = await resolveUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (roleName !== "admin" && user?.role?.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (roleName === "nbfc" && orgFilter && user.organization?.toLowerCase() !== orgFilter) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const updates = {};
    if (req.body?.name) {
      updates.name = normalizeString(req.body.name);
    }
    if (req.body?.email) {
      const nextEmail = normalizeString(req.body.email).toLowerCase();
      const existing = await userModel.findOne({ email: nextEmail });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(409).json({
          success: false,
          error: "Email already in use",
        });
      }
      updates.email = nextEmail;
    }
    if (req.body?.organization) {
      updates.organization = normalizeString(req.body.organization);
    }
    if (typeof req.body?.verificationAccess === "boolean") {
      updates.verificationAccess = req.body.verificationAccess;
    }

    if (req.body?.role) {
      const requestedRole = normalizeString(req.body.role).toLowerCase();
      if (roleName === "nbfc" && requestedRole !== "employee") {
        return res.status(400).json({
          success: false,
          error: "Invalid role for this organization",
        });
      }
      const roleDoc = await roleModel.findOne({ role: requestedRole });
      if (!roleDoc) {
        return res.status(400).json({
          success: false,
          error: "Role does not exist",
        });
      }
      updates.role = roleDoc._id;
    }

    const updated = await userModel.findByIdAndUpdate(user._id, updates, { new: true }).populate("role");

    return res.json({
      success: true,
      data: buildUserResponse(updated),
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization).toLowerCase();

    const user = await resolveUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (roleName !== "admin" && user?.role?.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (roleName === "nbfc" && orgFilter && user.organization?.toLowerCase() !== orgFilter) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    await userDriverMappingModel.deleteOne({ userId: user._id });
    await userModel.deleteOne({ _id: user._id });

    return res.json({
      success: true,
      data: { userId: user._id.toString() },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get driver mapping
router.get("/:id/driver-mapping", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization).toLowerCase();

    const user = await resolveUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (roleName !== "admin" && user?.role?.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (roleName === "nbfc" && orgFilter && user.organization?.toLowerCase() !== orgFilter) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const mapping = await userDriverMappingModel.findOne({ userId: user._id });

    return res.json({
      success: true,
      data: {
        userId: user._id.toString(),
        driverIds: mapping?.driverIds || [],
      },
    });
  } catch (error) {
    console.error("Get driver mapping error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Upsert driver mapping
router.post("/:id/driver-mapping", async (req, res) => {
  try {
    const auth = bothProtect(req, "userManagement");
    if (auth.status !== 200) {
      return res.status(auth.status).json({
        success: false,
        error: auth?.error?.message || "Unauthorized",
      });
    }

    const payload = getAuthPayload(req);
    const roleName = (getRoleName(payload) || "").toLowerCase();
    const orgFilter = normalizeString(payload?.organization).toLowerCase();

    const user = await resolveUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (roleName !== "admin" && user?.role?.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (roleName === "nbfc" && orgFilter && user.organization?.toLowerCase() !== orgFilter) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const incomingIds = Array.isArray(req.body?.driverIds) ? req.body.driverIds : [];
    const driverIds = [...new Set(incomingIds.map((id) => String(id)).filter(Boolean))];

    const mapping = await userDriverMappingModel.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        userEmail: user.email,
        organization: user.organization,
        driverIds,
        updatedBy: payload?.email || "",
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      data: {
        userId: user._id.toString(),
        driverIds: mapping?.driverIds || [],
      },
    });
  } catch (error) {
    console.error("Update driver mapping error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;