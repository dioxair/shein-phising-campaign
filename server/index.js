const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,
  standardHeaders: "draft-8",
});

app.set("trust proxy", 1); // Trust the first proxy
app.use(
  cors({
    origin: "https://dioxair.github.io",
    credentials: false,
  })
);

app.use(express.json());
app.use(limiter);
app.use(errorHandler);
app.use(confirmRequest);

app.get("/report-hit", (req, res) => {
  fs.appendFileSync(
    "logs/hits.txt",
    `${new Date().toLocaleString("en-US")}\nIP: ${req.ip}\n\n`
  );
  res.status(200).json({ successMessage: "pwned! :)" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}

function confirmRequest(req, res, next) {
  const allowedOrigin = "https://dioxair.github.io";
  const origin = req.get("Origin") || req.get("Referer");

  if (origin && origin.startsWith(allowedOrigin)) {
    next();
  } else {
    res.status(403).json({
      error:
        "Forbidden: Requests are only allowed from https://dioxair.github.io",
    });
  }
}
