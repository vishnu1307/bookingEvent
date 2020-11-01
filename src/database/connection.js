const env = process.env.NODE_ENV || "production";
const config = require("../../config/config.json")[env];
const Sequelize = require("sequelize");
const { Op } = Sequelize.Op;

//connection
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  ssl: config.ssl,
  port: config.port,
  define: {
    paranoid: true,
    freezeTableName: true
  }
})

module.exports = sequelize
global.sequelize = sequelize
