const { Sequelize } = require('sequelize');
const UserModel = require('./User');
const BookModel = require('./Book');
const dotenv = require('dotenv');
const config = require('../config/config');

dotenv.config();
const sequelizeConfig = config.development;

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
    logging: false, // Disable logging; default: console.log
  });

const User = UserModel(sequelize, Sequelize);
const Book = BookModel(sequelize, Sequelize);

User.associate({ Book });
Book.associate({ User });

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
  sequelize,
};
