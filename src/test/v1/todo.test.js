import { expect } from 'chai';
import { describe, it, after, before } from 'mocha';
import request from 'supertest';
import sinon from 'sinon';
// import 'sinon-mongoose';
import jsLogger from 'js-logger';

import server from '../../index';
import Todo from '../../v1/models/Todo';

const app = request(server);

jsLogger.info(`${process.env.NODE_ENV} >>>>>`);

describe('TODO API', () => {
  /**
   * Function to run before test begins
   */
  before((done) => {
    Todo.create({
      title: 'title test1',
      description: 'title description1',
    }).then(() => done());
  });

  /**
   * Function to run after test is completes
   */
  after((done) => {
    Todo.deleteMany().then(() => done());
  });

  describe('CREATE TODO', () => {
    it('should return Validation error if title is empty', (done) => {
      app
        .post('/api/v1/todos')
        .send({ title: '', description: 'description' })
        .expect(400)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result)
            .to.have.property('message')
            .which.is.a('string');
          expect(result.message).to.equal('There are problems with your input');
          expect(result)
            .to.have.property('errors')
            .which.is.an.instanceOf(Object);
          done();
        });
    });

    it('should create todo item if title and description values not empty', (done) => {
      app
        .post('/api/v1/todos')
        .send({ title: 'title1', description: 'description1' })
        .expect(201)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result)
            .to.have.property('title')
            .which.is.a('string');
          expect(result)
            .to.have.property('description')
            .which.is.a('string');
          expect(result.title).to.equal('title1');
          expect(result.description).to.equal('description1');
          done();
        });
    });

    it('should return error when mongoose fails to save todo item', (done) => {
      const sandbox = sinon.createSandbox();
      const createStub = sandbox.stub(Todo.prototype, 'save');
      createStub.rejects({});
      app
        .post('/api/v1/todos')
        .send({ title: 'title1', description: 'description1' })
        .expect(500)
        .end((err) => {
          if (err) return done(err);
          done();
          sandbox.restore();
        });
    });
  });
});
