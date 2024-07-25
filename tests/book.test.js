// test/book.test.js
const { chai, server } = require('./testSetup');
const { expect } = chai;
const { v4: uuidv4 } = require('uuid');

describe('Books API', () => {
  let adminToken;
  let sellerToken;
  let buyerToken;
  let bookId;

  before(async () => {
    // Register and login users to get tokens
    await chai.request(server)
      .post('/users/register')
      .send({ username: 'admin', password: 'password', role: 'Admin' });
    
    const adminLogin = await chai.request(server)
      .post('/users/login')
      .send({ username: 'admin', password: 'password' });
    adminToken = adminLogin.body.token;

    await chai.request(server)
      .post('/users/register')
      .send({ username: 'seller', password: 'password', role: 'Seller' });
    
    const sellerLogin = await chai.request(server)
      .post('/users/login')
      .send({ username: 'seller', password: 'password' });
    sellerToken = sellerLogin.body.token;

    await chai.request(server)
      .post('/users/register')
      .send({ username: 'buyer', password: 'password', role: 'Buyer' });
    
    const buyerLogin = await chai.request(server)
      .post('/users/login')
      .send({ username: 'buyer', password: 'password' });
    buyerToken = buyerLogin.body.token;
  });

  it('should create a book (Admin)', async () => {
    const res = await chai.request(server)
      .post('/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Book Title',
        author: 'Book Author',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        price: 19.99,
        stock: 10,
        genre: 'Fiction',
      });

    expect(res).to.have.status(201);
    expect(res.body).to.be.an('object');
    bookId = res.body.id;
  });

  it('should retrieve all books (All users)', async () => {
    const res = await chai.request(server)
      .get('/books')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(1);
  });

  it('should retrieve a specific book by ID (All users)', async () => {
    const res = await chai.request(server)
      .get(`/books/${bookId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.equal(bookId);
  });

  it('should update a book (Admin)', async () => {
    const res = await chai.request(server)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Book Title',
        price: 24.99,
      });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.title).to.equal('Updated Book Title');
    expect(res.body.price).to.equal(24.99);
  });

  it('should delete a book (Admin)', async () => {
    const res = await chai.request(server)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res).to.have.status(204);
  });
});
