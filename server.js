require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('node:path');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 60 * 1000,  // 10 minutes
    sameSite: "lax"          // IMPORTANT for captcha/session
  }
}));

/* ✅ 3. Body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ✅ 4. Static files serve */
app.use(express.static("public"));

/* ✅ 5. API routes */
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

/* ✅ 6. Main website route */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ✅ Start server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
