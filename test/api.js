const chai = require('chai');
const request = require('supertest');
const app = require('../src/config/server/server').default;
const UserModel = require('../src/components/User/model').default;
const StackModel = require("../src/components/Stack/model").default;
const user = require("./fixtures/user.json");
const stack = require("./fixtures/stack.json");

chai.should();

/**
 * API tests
 */

describe('API', () => {

    it('get all users', (done) => {
        request(app)
            .get('/v1/users')
            .set('x-access-token', global.token)
            .expect((res) => {
                res.status.should.equal(200);
                res.body.should.be.an('array');
            })
            .end(done);
    });

    it('create new user', (done) => {
        const newUser = {
            email: 'new.user@gmail.com',
            name: 'John Doe'
        };

        request(app)
            .post('/v1/users')
            .send(newUser)
            .set('x-access-token', global.token)
            .expect((res) => {
                res.status.should.equal(201);
                res.body.should.have.property('email');
            })
            .end(done);
    });

    // stacks routes

    it("create new stack", (done) => {
        const newStack = {
          name: "testStack4",
          wikipediaLink: "https://en.wikipedia.com/testStack2",
        };

      request(app)
        .post("/v1/stacks")
        .send(newStack)
        .set("x-access-token", global.token)
        .expect((res) => {
          res.status.should.equal(201);
          res.body.should.have.property("wikipediaLink");
        })
        .end(done);
    });

    it("get all stacks", (done) => {
        request(app)
        .get("/v1/stacks")
        .set("x-access-token", global.token)
        .expect((res) => {
            res.status.should.equal(200);
            res.body.should.be.an("array");
        })
        .end(done);
    });

    it("get stack by id", (done) => {
        let _id = "5fad43dd35fd7a038acc1cfc";
        request(app)
          .get(`/v1/stacks/${_id}`)
          .set("x-access-token", global.token)
          .expect((res) => {
            res.status.should.equal(200);
          })
          .end(done);
    });

    it("update stack", (done) => {
        const updatedStack = {
          _id: "5fad43dd35fd7a038acc1cfc",
          name: "test2",
          wikipediaLink: "https://en.wikipedia.org/wiki/test2",
        };
        request(app)
          .patch(`/v1/stacks/${updatedStack._id}`)
          .send(updatedStack)
          .set("x-access-token", global.token)
          .expect((res) => {
            res.status.should.equal(200);
            res.body.should.have.property("ok");
          })
          .end(done);
    });

    it("delete stack", (done) => {
      let _id = "5fad43dd35fd7a038acc1cfc";
      request(app)
        .delete(`/v1/stacks/${_id}`)
        .set("x-access-token", global.token)
        .expect((res) => {
          res.status.should.equal(200);
        })
        .end(done);
    });
});

/**
 * clear database after tests
 */

after(async () => {
    try {
        await UserModel.collection.drop();
        await StackModel.collection.drop();
        await db.UserModel.drop();
        await db.StackModel.drop();
        await test_users.collection.drop();

    } catch (error) {
        console.log('Something went wrong after tests, seems your database doesnt cleaned');
    }
});
