// models/Url.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Url = sequelize.define("Url", {
    originalUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Url;
};
