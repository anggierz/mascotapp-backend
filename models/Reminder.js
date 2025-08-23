const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pet = require('./Pet');

const Reminder = sequelize.define('Reminder', {
    type: {
        type: DataTypes.ENUM('vaccination', 'deworming'),
        allowNull: false,
    },
    remind_every: {
        type: DataTypes.ENUM('day', 'week', 'month', 'year'),
        allowNull: false,
    },
    frequency: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    last_execution: {
        type: DataTypes.DATE,
    },
    next_execution: {
        type: DataTypes.DATE,
    }
});

Pet.hasMany(Reminder);
Reminder.belongsTo(Pet);

module.exports = Reminder;