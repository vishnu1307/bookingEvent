const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    numberOfSeat: {
      type: Sequelize.STRING,
      allowNull: true
    },
    attendee: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
  }, {
      freezeTableName: true
    });
  return Event;
};
