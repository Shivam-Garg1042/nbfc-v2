import bcrypt from "bcryptjs";

async function generateHashes() {
  const saltRounds = 10; // Same as your backend
  
  const admin123 = await bcrypt.hash('admin123', saltRounds);
  const employee123 = await bcrypt.hash('employee123', saltRounds);
  const nbfc123 = await bcrypt.hash('nbfc123', saltRounds);
  
  console.log('admin123 hash:', admin123);
  console.log('employee123 hash:', employee123);
  console.log('nbfc123 hash:', nbfc123);
}

generateHashes();