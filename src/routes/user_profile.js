const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");
const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Protected Route Example
router.get("/profile", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, name: true, email: true },
  });

  res.json({ message: "Protected profile", user });
});

// update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  const updated_data = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: updated_data,
  });
  res.json({ message: "Profile updated", user });
});

module.exports = router;
