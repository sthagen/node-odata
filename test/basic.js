require('should');
const supertest = require('supertest');
const createError = require('http-errors');
const { conn, bookSchema, initData } = require('./support/setup');
const odata = require('../');

class Book extends odata.Resource {
  constructor() {
    super('book', bookSchema);
  }

  async willQueryList(query) {
    console.log('willQuery:', query)
  }

  async didQueryList(data) {
    console.log('didQueryList', data)
  }
}

describe('rest.get', () => {
  let data, request;

  before(async function() {
    data = await initData();
    const app = new odata({ conn });
    const server = app.listen();
    request = supertest(server);
    app.use(Book);
  });

  it('should return all of the resources', async function() {
    const res = await request.get(`/book`);
    res.body.should.be.have.property('value');
    res.body.value.length.should.be.equal(data.length);
  });
});
