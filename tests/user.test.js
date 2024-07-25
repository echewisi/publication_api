const { chai, server } = require('./testSetup');
const { expect } = chai;

describe('Users API', () => {
  let adminToken;
  let userId;

  before(async () => {
    // Register and login admin to get token
    await chai.request(server)
      .post('/users/register')
      .send({ username: 'admin', password: 'password', role: 'Admin' });

    const adminLogin = await chai.request(server)
      .post('/users/login')
      .send({ username: 'admin', password: 'password' });
    adminToken = adminLogin.body.token;
  });

  it('should register a new user', async () => {
    const res = await chai.request(server)
      .post('/users/register')
      .send({ username: 'newUser', password: 'password' });

    expect(res).to.have.status(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('username', 'newUser');
    userId = res.body.id;
  });

  it('should authenticate a user and return a JWT', async () => {
    const res = await chai.request(server)
      .post('/users/login')
      .send({ username: 'newUser', password: 'password' });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('token');
  });

  it('should assign a role to a user (Admin only)', async () => {
    const res = await chai.request(server)
      .post('/users/role')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'newUser', role: 'Seller' });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('role', 'Seller');
  });

  it('should fail to assign a role without admin privileges', async () => {
    const newUserLogin = await chai.request(server)
      .post('/users/login')
      .send({ username: 'newUser', password: 'password' });
    const newUserToken = newUserLogin.body.token;

    const res = await chai.request(server)
      .post('/users/role')
      .set('Authorization', `Bearer ${newUserToken}`)
      .send({ username: 'newUser', role: 'Buyer' });

    expect(res).to.have.status(403);
  });

  it('should fail to register a user with an existing username', async () => {
    const res = await chai.request(server)
      .post('/users/register')
      .send({ username: 'newUser', password: 'password' });

    expect(res).to.have.status(400);
  });

  it('should fail to login with incorrect credentials', async () => {
    const res = await chai.request(server)
      .post('/users/login')
      .send({ username: 'newUser', password: 'wrongpassword' });

    expect(res).to.have.status(401);
  });
});
