const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");
const app = express();

app.use(cors());

// Mount routers
app.use(express.json());

// Sanitize data (prevent SQL injection)
app.use(mongoSanitize());

// Use helmet (set security headers)
app.use(helmet());

// Use xss (prevent xss attacks)
app.use(xss());

// Use hpp (prevent http params pollutions)
app.use(hpp());

// Enable CORS
app.use(cors());

// Rate limiting (limit 100 requests within 10 minutes)
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Mount routers
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

// Cookie parser
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(
    "Server is running in",
    process.env.NODE_ENV,
    "mode on port",
    PORT
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);

  // close server & exit process
  server.close(() => process.exit);
});
