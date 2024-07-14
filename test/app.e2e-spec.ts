import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Token } from '../src/token/token.entity';

describe('API (e2e)', () => {
  let app: INestApplication;
  let memberToken: Token;
  let adminToken: Token;

  // re-use this value to test for duplicate
  const productCode = `${new Date().valueOf()}`;
  const createBody = { productCode, location: 'KL', price: 1000 };

  // keep memory of product to test that product has been updated
  let productBeforeUpdate = { id: 0, productCode: '', location: '', price: 0 };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /token/member', () => {
    it('should return HTTP status 200 with a token object', async () => {
      const response = await request(app.getHttpServer()).post('/token/member');
      expect(response.status).toEqual(200);

      memberToken = response.body;
      expect(memberToken.accessToken).toBeDefined();
    });
  });

  describe('POST /token/admin', () => {
    it('should return HTTP status 200 with a token object', async () => {
      const response = await request(app.getHttpServer()).post('/token/admin');
      expect(response.status).toEqual(200);

      adminToken = response.body;
      expect(adminToken.accessToken).toBeDefined();
    });
  });

  describe('GET /product', () => {
    it('should return HTTP status 200 when token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ productCode: '1000', location: 'KL' })
        .set('Authorization', `Bearer ${memberToken.accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: expect.any(Number),
        productCode: '1000',
        location: 'KL',
        price: expect.any(Number),
      });
    });

    it('should return HTTP status 401 when token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/product');
      expect(response.status).toEqual(401);
    });

    it('should return HTTP status 400 when productCode or location is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/product')
        .set('Authorization', `Bearer ${memberToken.accessToken}`)
        .query({ productCode: '1000' });

      const response2 = await request(app.getHttpServer())
        .get('/product')
        .set('Authorization', `Bearer ${memberToken.accessToken}`)
        .query({ location: 'KL' });

      expect(response.status).toEqual(400);
      expect(response2.status).toEqual(400);
    });

    it('should return HTTP status 404 when product is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ productCode: '9999', location: 'KL' })
        .set('Authorization', `Bearer ${memberToken.accessToken}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('POST /product', () => {
    it('should return HTTP status 200 when admin token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/product')
        .send(createBody)
        .set('Authorization', `Bearer ${adminToken.accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: expect.any(Number),
        productCode: createBody.productCode,
        location: createBody.location,
        price: createBody.price,
      });

      // keep this for further testing
      productBeforeUpdate = response.body;
    });

    it('should return HTTP status 400 when dupicate productCode is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send(createBody);

      expect(response.status).toEqual(400);
    });

    it('should return HTTP status 401 when token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/product')
        .send({ productCode: '5000', location: 'KL', price: 1000 });

      expect(response.status).toEqual(401);
    });

    it('should return HTTP status 403 when admin token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${memberToken.accessToken}`)
        .send({ productCode: '5000', location: 'KL', price: 1000 });

      expect(response.status).toEqual(403);
    });

    it('should return HTTP status 400 when productCode or location or price is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send({ productCode: '1000', location: 'KL' });

      const response2 = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ location: 'KL', price: 1000 });

      const response3 = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: '1000', price: 1000 });

      expect(response.status).toEqual(400);
      expect(response2.status).toEqual(400);
      expect(response3.status).toEqual(400);
    });
  });

  describe('PUT /product', () => {
    it('should return HTTP status 200 when admin token is provided', async () => {
      const updateBody = { location: 'SG', price: 2000 };
      const response = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode })
        .send(updateBody);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: expect.any(Number),
        productCode: productBeforeUpdate.productCode,
        location: updateBody.location,
        price: updateBody.price,
      });

      expect(productBeforeUpdate.id).toEqual(response.body.id);
      expect(productBeforeUpdate.productCode).toEqual(
        response.body.productCode,
      );
      expect(productBeforeUpdate.location).not.toEqual(response.body.location);
      expect(productBeforeUpdate.price).not.toEqual(response.body.price);
    });

    it('should return HTTP status 401 when token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/product')
        .query({ productCode: productBeforeUpdate.productCode })
        .send({ location: 'SG', price: 1000 });

      expect(response.status).toEqual(401);
    });

    it('should return HTTP status 403 when admin token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${memberToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode })
        .send({ location: 'SG', price: 1000 });

      expect(response.status).toEqual(403);
    });

    it('should return HTTP status 400 when productCode or location or price is not provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send({ location: 'SG', price: 2000 });

      const response2 = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode })
        .send({ location: 'SG' });

      const response3 = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode })
        .send({ price: 1000 });

      expect(response.status).toEqual(400);
      expect(response2.status).toEqual(400);
      expect(response3.status).toEqual(400);
    });

    it('should return HTTP status 404 when product is not found', async () => {
      const response = await request(app.getHttpServer())
        .put('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: '9999' })
        .send({ location: 'SG', price: 2000 });

      expect(response.status).toEqual(404);
    });
  });

  describe('DELETE /product', () => {
    it('should return HTTP status 204 when admin token is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode });

      expect(response.status).toEqual(204);
    });

    it('should return HTTP status 401 when token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/product')
        .query({ productCode: productBeforeUpdate.productCode });

      expect(response.status).toEqual(401);
    });

    it('should return HTTP status 403 when admin token is not provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/product')
        .set('Authorization', `Bearer ${memberToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode });

      expect(response.status).toEqual(403);
    });

    it('should return HTTP status 400 when productCode is not provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`);

      expect(response.status).toEqual(400);
    });

    it('should return HTTP status 404 when product is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: '9999' });

      const response2 = await request(app.getHttpServer())
        .delete('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .query({ productCode: productBeforeUpdate.productCode });

      expect(response.status).toEqual(404);
      expect(response2.status).toEqual(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
