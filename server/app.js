const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

require("./config/testConnection");

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);

app.get("/", (req, res) => {
  res.send("CCN API Running...");
});

const PORT = process.env.PORT || 3001;

const authRoutes =
  require("./routes/authRoutes");
app.use(
  "/api/auth",
  authRoutes
);
const adminRoutes =
  require(
    "./routes/adminRoutes"
  );
  app.use(
  "/api/admin",
  adminRoutes
);

const serviceRequestRoutes =
require(
"./routes/serviceRequestRoutes"
);
app.use(
  "/api/service-requests",
  serviceRequestRoutes
);

const customerRoutes =
require(
"./routes/customerRoutes"
);
app.use(
  "/api/customers",
  customerRoutes
);

const subscriberRoutes =
require(
"./routes/subscriberRoutes"
);
app.use(
  "/api/subscribers",
  subscriberRoutes
);
  
const billingRoutes =
require(
"./routes/billingRoutes"
);
app.use(
  "/api/bills",
  billingRoutes
);

const paymentRoutes =
require(
"./routes/paymentRoutes"
);
app.use(
  "/api/payments",
  paymentRoutes
);

const newsRoutes =
require(
"./routes/newsRoutes"
);
app.use(
  "/api/news",
  newsRoutes
);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
