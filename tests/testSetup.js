// test/testSetup.js
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const { sequelize } = require('../models');

chai.use(chaiHttp);

before(async () => {
  await sequelize.sync({ force: true }); // Reset the database
});

module.exports = {
  chai,
  server,
};
