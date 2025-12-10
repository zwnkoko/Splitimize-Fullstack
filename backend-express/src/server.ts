import dotenv from "dotenv";

// Load .env only if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log("Loaded environment variables from .env");
}

function checkEnvVars(vars: string[]) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `\n❌ Missing required environment variables: ${missing.join(", ")}\n` +
        "Please create a .env file based on .env.example and fill in the missing values.\n" +
        "See the README for more details.\n"
    );
    process.exit(1);
  }
}

checkEnvVars([
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "DATABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "FRONTEND_URL",
  "GEMINI_API_KEY",
  "OCR_SPACE_API_KEY",
]);

import app from "./app";
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
