const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

//-- for sqlite below---
// const sequelize = new Sequelize(config);

// now used postgress for neon
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const Url = require("./Url")(sequelize);

module.exports = {
  sequelize,
  Url,
};
