const request = require('supertest');
const app = require('../src/app');

describe('Online Banking API', () => {

  test('GET /accounts returns bank accounts', async () => {
    const res = await request(app).get('/accounts');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /accounts/1/balance returns account balance', async () => {
    const res = await request(app).get('/accounts/1/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body.accountId).toBe(1);
    expect(res.body.balance).toBeGreaterThan(0);
  });

  test('POST /transfer creates a successful transfer', async () => {
    const res = await request(app)
      .post('/transfer')
      .send({ fromAccount: 1, toAccount: 2, amount: 500 });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.amount).toBe(500);
  });

  test('POST /transfer rejects insufficient balance', async () => {
    const res = await request(app)
      .post('/transfer')
      .send({ fromAccount: 1, toAccount: 2, amount: 999999999 });

    expect(res.statusCode).toBe(400);
  });

  test('GET /accounts/999/balance returns 404', async () => {
    const res = await request(app).get('/accounts/999/balance');
    expect(res.statusCode).toBe(404);
  });

});