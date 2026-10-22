import express from 'express';
import helmet from "helmet";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const router = express.Router();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for handling 404 errors
export function route404(req, res) {
  const error = new Error("Not found");
  console.log(error.message);

  res.status(404).json({
    error: {
      message: error.message,
    },
  });
}

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true, optionsSuccessStatus: 200 }));

// Set Permissions-Policy header
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "autoplay=(*)");
  next();
});

// Define a global error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error. Error 505' });
});

// Handle preflight requests
app.options('/*', (req, res) => {
  res.status(204).end();
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'CLIENT', 'public', 'image')));

// Routes
router.get("/main/health", (req, res) => {
  console.info("Healthcheck route called successfully!");
  return res.status(200).json({ message: "working as expected!" });
});

// Use the router
app.use("/", router);

console.log("----------------------------------------");
console.log("Define Routing Error");
console.log("----------------------------------------");

// Handle 404 errors
app.use(route404);

export default app;
