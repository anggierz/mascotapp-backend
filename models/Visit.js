const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pet = require('./Pet');

const Visit = sequelize.define('Visit', {
    visit_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    clinic_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
    },
    conclusion: {
        type: DataTypes.STRING,
    }
});

Pet.hasMany(Visit);
Visit.belongsTo(Pet);

module.exports = Visit;