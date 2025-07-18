const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const sequelize = new Sequelize(config);

const Url = require("./Url")(sequelize);

module.exports = {
  sequelize,
  Url,
};
