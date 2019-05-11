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
  let todoId = '';
  const titleTest = 'title test1';
  const descriptionTest = 'description test1';
  /**
   * Function to run before test begins
   */
  before((done) => {
    Todo.create({
      title: titleTest,
      description: descriptionTest,
    }).then((result) => {
      todoId = result._id; // eslint-disable-line
      done();
    });
  });

  /**
   * Function to run after test is completes
   */
  after((done) => {
    Todo.deleteMany().then(() => done());
  });

  describe('CREATE TODO', () => {
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

    it('should return error when mongoose fails to save todo item', (done) => {
      const sandbox = sinon.createSandbox();
      const createStub = sandbox.stub(Todo.prototype, 'save');
      createStub.throws({});
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

  describe('GET TODO', () => {
    it('should return todo item for item id present in db', (done) => {
      app
        .get(`/api/v1/todos/${todoId}`)
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.title).to.equal(titleTest);
          expect(result.description).to.equal(descriptionTest);
          done();
        });
    });

    it('should return 404 if item id not present in db', (done) => {
      app
        .get('/api/v1/todos/1234')
        .expect(404)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.message).to.equal('Todo item with not found');
          done();
        });
    });

    it('should return paginated list of action items', (done) => {
      app
        .get('/api/v1/todos')
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result)
            .to.have.property('paginationMeta')
            .which.is.an.instanceOf(Object);
          expect(result.paginationMeta).to.have.property('pageSize');
          expect(result.paginationMeta).to.have.property('currentPage');
          expect(result)
            .to.have.property('todos')
            .which.is.an('array');
          done();
        });
    });

    it('should return paginated list action items with limit per page of the limit query', (done) => {
      app
        .get('/api/v1/todos?limit=1')
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.paginationMeta).to.have.property('pageSize');
          expect(result.paginationMeta.pageSize).to.equal(1);
          done();
        });
    });

    it('should return error when mongoose fails to fetch todo item', (done) => {
      const sandbox = sinon.createSandbox();
      const createStub = sandbox.stub(Todo, 'findById');
      createStub.throws({});
      app
        .get(`/api/v1/todos/${todoId}`)
        .expect(500)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
          sandbox.restore();
        });
    });

    it('should return error when mongoose fails to list todo items', (done) => {
      const sandbox = sinon.createSandbox();
      const createStub = sandbox.stub(Todo, 'find');
      createStub.throws({});
      app
        .get('/api/v1/todos')
        .expect(500)
        .end((err) => {
          if (err) return done(err);
          done();
          sandbox.restore();
        });
    });
  });

  describe('UPDATE TODO', () => {
    it('should update todo item for specified id', (done) => {
      app
        .patch(`/api/v1/todos/${todoId}`)
        .send({ title: 'title test1' })
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.title).to.equal('title test1');
          expect(result.description).to.equal(descriptionTest);
          done();
        });
    });

    it('should return Validation error if completed field is not booloen', (done) => {
      app
        .patch(`/api/v1/todos/${todoId}`)
        .send({ title: 'title', completed: 'completed' })
        .expect(400)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.message).to.equal('There are problems with your input');
          expect(result).to.have.property('errors');
          done();
        });
    });

    it('should return error if all the required fields are not sent', (done) => {
      app
        .patch(`/api/v1/todos/${todoId}`)
        .send({})
        .expect(400)
        .end((err, response) => {
          if (err) return done(err);
          const { body: result } = response;
          expect(result.message).to.equal(
            'At least of of title, description and completed must be sent with this request'
          );
          done();
        });
    });

    it('should return error when mongoose fails to save todo item', (done) => {
      const sandbox = sinon.createSandbox();
      const createStub = sandbox.stub(Todo.prototype, 'save');
      createStub.throws({});
      app
        .patch(`/api/v1/todos/${todoId}`)
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
