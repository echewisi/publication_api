const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const config = require('../config/config');

dotenv.config();

const sequelizeConfig = config[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  dialect: sequelizeConfig.dialect,
  logging: false, // Disable logging; default: console.log
});

const User = require('./User')(sequelize);
const Book = require('./Book')(sequelize);
const Sale = require('./Sale')(sequelize);

User.associate({ Book, Sale });
Book.associate({ User, Sale });
Sale.associate({ Book, User });

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = {
  User,
  Book,
  Sale,
  sequelize,
};
