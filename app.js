require("dotenv").config();
const express = require("express");
const app = express();
const urlRoutes = require("./src/routes/urlRoutes");
const { sequelize } = require("./src/models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", urlRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(3000, () =>
    console.log(`✅ Server running at http://localhost:3000`)
  );
});

module.exports = app;
