// TEMPORARY dev script - delete once real Google login is working.
// Run with: node generateTestToken.js

require("dotenv").config();
const jwt = require("jsonwebtoken");

// Paste the _id of the test user you inserted in MongoDB Compass:
const testUserId = "6a738b3b052424b34fa3ee85";

const token = jwt.sign(
  { id: testUserId, role: "student" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

console.log("\nYour test JWT (paste into Postman as Bearer Token):\n");
console.log(token);
console.log("");
