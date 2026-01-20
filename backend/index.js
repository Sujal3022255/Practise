const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./database/Database");
const cors = require("cors")
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())
app.use("/uploads", express.static("uploads"));

app.use("/api/user/", require('./routes/UserRoutes'))
app.use("/api/product/", require('./routes/ProductRoutes'))

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Page" });
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
  });
};
startServer();