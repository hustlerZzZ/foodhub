import express from "express";
import helmet from "helmet";
import cors from "cors";

import adminRoute from "./routes/adminRoute";
import userRoute from "./routes/userRoute";
import restaurantRoute from "./routes/restaurantRoute";

const app = express();

// Allow to parse JSON
app.use(express.json());

// Allowing Cors
app.use(cors());

// Adding some security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// API
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);

// Global Route Handler
app.use("*", function (req, res) {
  res.status(404).json({
    status: "Error",
    msg: "Route is not defined yet!",
  });
});

// Creating a Server to listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
