//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Card = require('../app/models/card.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Cards', () => {
    beforeEach((done) => { //Before each test we empty the database
        Card.remove({}, (err) => { 
           done();           
        });        
    });

    describe('/GET Cards', () => {
        /*
        * Test the /GET route
        */
        it('it should GET all the Cards', (done) => {
            chai.request(server)
                .get('/cards/getall')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
            });
        });

        /*
        * Test the /GET route
        */
        it('It should return a status 200', (done) => {
            let card = {
                name: "John Doe",
                number: 38520000023237,
                limit: 10000
            }
            chai.request(server)
            .post('/cards/add')
            .send(card)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });
});
