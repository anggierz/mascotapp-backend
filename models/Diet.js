const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pet = require('./Pet');

const Diet = sequelize.define('Diet', {
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    food_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grams_per_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

Pet.hasMany(Diet);
Diet.belongsTo(Pet);

module.exports = Diet;