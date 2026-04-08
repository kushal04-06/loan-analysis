require("dotenv").config();
const app = require("./app");
const { ensureSecureUsers } = require("./store");

const port = Number(process.env.PORT || 5000);
const hasDefaultSecret = !process.env.JWT_SECRET;

async function startServer() {
  await ensureSecureUsers();

  if (hasDefaultSecret) {
    console.warn("JWT_SECRET is not set. Set it in .env before deploying to production.");
  }

  const server = app.listen(port, () => {
    console.log(`Loan backend listening on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Another backend instance may already be running at http://localhost:${port}`
      );
      process.exit(1);
    }

    console.error("Server failed to start:", err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
