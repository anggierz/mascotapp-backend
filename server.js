const app = require('./app');
const sequelize = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log("Database synchronized");
    
    app.listen(PORT, () => {
        console.log(`Seerver is running on port ${PORT}`);
    });
});