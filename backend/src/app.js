const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { readStore, writeStore } = require("./store");

const app = express();
const jwtSecret = process.env.JWT_SECRET || "change-this-in-production";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      name: user.name
    },
    jwtSecret,
    { expiresIn: "8h" }
  );
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ ok: false, message: "Missing authorization token" });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_err) {
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "OPTIONS"]
  })
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Loan Backend</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; background: #0f172a; color: #e2e8f0; }
      code { background: #1e293b; padding: 2px 6px; border-radius: 4px; }
      a { color: #38bdf8; }
      .box { max-width: 760px; border: 1px solid #334155; border-radius: 10px; padding: 20px; background: #111827; }
      li { margin: 8px 0; }
    </style>
  </head>
  <body>
    <div class="box">
      <h2>Loan Analysis Backend is running</h2>
      <p>This server provides API endpoints for your frontend.</p>
      <ul>
        <li>Health: <a href="/api/health"><code>/api/health</code></a></li>
        <li>Login: <code>POST /api/auth/login</code></li>
        <li>Loan prediction: <code>POST /api/loan/predict</code></li>
        <li>Dashboard: <code>GET /api/dashboard</code> and <code>PUT /api/dashboard</code></li>
      </ul>
      <p>Open your frontend HTML pages via Live Server (not from <code>localhost:5000</code>).</p>
    </div>
  </body>
</html>`);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.use("/api/auth", authLimiter);

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "username and password are required"
    });
  }

  const store = await readStore();
  const user = (store.users || []).find((u) => u.username === String(username).trim());

  if (!user || !user.passwordHash) {
    return res.status(401).json({
      ok: false,
      message: "Invalid credentials"
    });
  }

  const matched = await bcrypt.compare(String(password), String(user.passwordHash));
  if (!matched) {
    return res.status(401).json({
      ok: false,
      message: "Invalid credentials"
    });
  }

  const token = createToken(user);

  return res.json({
    ok: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name
    }
  });
});

app.post("/api/loan/predict", (req, res) => {
  const { fullName, annualIncome, loanAmount, creditScore } = req.body || {};

  const income = Number(annualIncome);
  const amount = Number(loanAmount);
  const score = Number(creditScore);
  const name = String(fullName || "Applicant").trim();

  if (
    !Number.isFinite(income) ||
    !Number.isFinite(amount) ||
    !Number.isFinite(score) ||
    income <= 0 ||
    amount <= 0 ||
    score < 300 ||
    score > 900
  ) {
    return res.status(400).json({
      ok: false,
      message: "Provide valid annualIncome, loanAmount, and creditScore (300-900)"
    });
  }

  let status = "declined";
  let message = "";

  if (score >= 700 && income > amount * 0.3) {
    status = "approved";
    message = `Approved for ${name}. Excellent probability of loan approval.`;
  } else if (score >= 600) {
    status = "moderate";
    message = `Moderate eligibility for ${name}. Collateral or co-signer may be required.`;
  } else {
    message = `Declined for ${name}. Credit score and income ratio are too low.`;
  }

  res.json({
    ok: true,
    data: {
      fullName: name,
      annualIncome: income,
      loanAmount: amount,
      creditScore: score,
      status,
      message
    }
  });
});

app.get("/api/dashboard", authenticate, async (_req, res) => {
  const store = await readStore();
  res.json({ ok: true, data: store.dashboard });
});

app.put("/api/dashboard", authenticate, async (req, res) => {
  const payload = req.body || {};
  const store = await readStore();

  const nextDashboard = {
    ...store.dashboard,
    ...payload,
    overviewChart: {
      ...store.dashboard.overviewChart,
      ...(payload.overviewChart || {})
    }
  };

  const nextStore = { ...store, dashboard: nextDashboard };
  await writeStore(nextStore);

  res.json({
    ok: true,
    message: "Dashboard data updated",
    data: nextDashboard
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    message: "Internal server error"
  });
});

module.exports = app;
