const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Pet = sequelize.define('Pet', {
  type: {
    type: DataTypes.ENUM('dog', 'cat'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  breed: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  }
});

User.hasMany(Pet);
Pet.belongsTo(User);

module.exports = Pet;