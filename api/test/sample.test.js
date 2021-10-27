const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../server')

describe('Unit testing a route', function() {

    it('should return OK status', function() {
        return request(app)
            .post('/api/register')
            .then(function(response){
                assert.equal(response.status, 200)
            })
    });
});