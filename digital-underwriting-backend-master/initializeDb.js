import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";
import userModel from "./MongoDB/userModel.js";
import roleModel from "./MongoDB/roleModel.js";

dotenv.config();

async function initializeDatabase() {
  try {
    const mongoDnsServers = process.env.MONGODB_DNS_SERVERS
      ? process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
      : ["8.8.8.8", "1.1.1.1"];
    dns.setServers(mongoDnsServers);
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('📚 Connected to MongoDB');

    // Create roles if they don't exist
    const adminRole = await roleModel.findOne({ role: 'admin' });
    if (!adminRole) {
      const newAdminRole = await roleModel.create({
        role: 'admin',
        permissions: ['NBFCDashboard', 'dashboard', 'actionableInsights', 'businessInsights', 'onboardedDrivers', 'verification', 'userManagement']
      });
      console.log('✅ Admin role created:', newAdminRole._id);
    } else {
      console.log('✅ Admin role exists:', adminRole._id);
    }

    const employeeRole = await roleModel.findOne({ role: 'employee' });
    if (!employeeRole) {
      const newEmployeeRole = await roleModel.create({
        role: 'employee',
        permissions: ['NBFCDashboard', 'dashboard', 'actionableInsights', 'businessInsights', 'onboardedDrivers', 'verification']
      });
      console.log('✅ Employee role created:', newEmployeeRole._id);
    } else {
      console.log('✅ Employee role exists:', employeeRole._id);
    }

    const nbfcRole = await roleModel.findOne({ role: 'nbfc' });
    if (!nbfcRole) {
      const newNbfcRole = await roleModel.create({
        role: 'nbfc',
        permissions: ['NBFCDashboard', 'dashboard', 'onboardedDrivers']
      });
      console.log('✅ NBFC role created:', newNbfcRole._id);
    } else {
      console.log('✅ NBFC role exists:', nbfcRole._id);
    }

    // Update admin user to have admin role
    const adminUser = await userModel.findOne({ email: 'admin@chargeup.com' });
    if (adminUser && !adminUser.role) {
      const adminRoleDoc = await roleModel.findOne({ role: 'admin' });
      adminUser.role = adminRoleDoc._id;
      await adminUser.save();
      console.log('✅ Admin user role updated');
    } else if (adminUser) {
      console.log('✅ Admin user already has role');
    } else {
      // Create admin user if doesn't exist
      const adminRoleDoc = await roleModel.findOne({ role: 'admin' });
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newAdminUser = await userModel.create({
        name: 'ChargeUp Admin',
        email: 'admin@chargeup.com',
        password: hashedPassword,
        role: adminRoleDoc._id,
        organization: 'ChargeUp'
      });
      console.log('✅ Admin user created');
    }

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();