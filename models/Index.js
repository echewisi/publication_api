const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const config = require('../config/config');

dotenv.config();

let sequelize;
if (process.env.NODE_ENV === 'production') {
  const sequelizeConfig = config['production']
  sequelize = new Sequelize(sequelizeConfig.url, {
    // database: 'publication',
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
  });
} else {
  const sequelizeConfig = config['development'];
  sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
    logging: false,
    
  });
}

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
