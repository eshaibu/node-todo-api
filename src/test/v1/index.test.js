import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import jsLogger from 'js-logger';
import server from '../../index';

const app = request(server);

jsLogger.info(`${process.env.NODE_ENV} >>>>>`);

describe('GENERAL ROUTE', () => {
  it('should return 404 if route not found', (done) => {
    app
      .get('/invalidRoute')
      .expect(404)
      .end((err, response) => {
        if (err) return done(err);
        const { body: result } = response;
        expect(result)
          .to.have.property('message')
          .which.is.a('string');
        expect(result.message).to.equal('This route does not exist. Visit /api/v1/**');
        done();
      });
  });

  it('should return message when home route visited', (done) => {
    app
      .get('/')
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        const { body: result } = response;
        expect(result)
          .to.have.property('message')
          .which.is.a('string');
        expect(result.message).to.equal('Visit /api/v1/**');
        done();
      });
  });

  it('should return "Welcome to V1 API" message when v1 home route visited', (done) => {
    app
      .get('/api/v1')
      .expect(200)
      .end((err, response) => {
        // console.log(response.body); // eslint-disable-line
        if (err) return done(err);
        expect(response.body.message).to.equal('Welcome to V1 API');
        done();
      });
  });
});
