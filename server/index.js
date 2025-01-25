const express = require("express");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,
  standardHeaders: "draft-8",
});

app.use(express.json());
app.use(limiter);
app.use(errorHandler);

app.get("/report-hit", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://dioxair.github.io");
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
