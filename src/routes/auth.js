const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "ab226eeb8a2ef823daec80c86412fbd8426bb1645996677c2100320d812e4fbaab17e7b93af8a42a92c163e93ebd8a198f18abdbe59b566b3c248c8997a63c37232b706636489bb63be338497e4d8b8600f6a287826083509aeeb0a9aa7d784cabc5a4769e11feecedfd0d3e5e96d17b90f03df49e6e176b6dd3cf134a8b3762308a2c556d947b729a0823866131a054ca06f6df7d69266624e1cd030ecc20748d86813de92e915ab6d2ace139168657758d54782af6db5edc70ebfac6b9bdc9720c2d1c2f2b6f21ef090e04ad173b30a689fa20af7cbfe8ffc78256879bea6f4d4deaf4764e9b1c373d2464a90641069bdd4a6e73f982b119e985edd6f3ad81";

// ✅ User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "Email already in use" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(201).json({ message: "User registered successfully", user });
});

// ✅ User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Login successful", token });
});

// ✅ Protected Route Example
router.get("/profile", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, name: true, email: true },
  });

  res.json({ message: "Protected profile", user });
});

// ✅ Middleware for Protected Routes
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = router;
