
let chai = require('chai');
let chaiHttp = require('chai-http');
const supertest = require('supertest');
const app = require('../../app/app');
const Business = require('../../app/models/business/Business');
const Branch = require('../../app/models/service/Branch.js');
const Category = require('../../app/models/service/Category.js');

let should = chai.should();
chai.use(chaiHttp);

describe('Businesses Tests', () => {

    it('it should GET a business by the given id', (done) => {
        const newBranch = new Branch({
            location: 'Nasr City',
            address: '123 nasr street',
        });

        newBranch.save((err, newbran) => {
            if (err) {
                console.log(err);
            }
        });

        const newCategory = new Category({
            type: 'Service',
            title: 'Nasr City',
        });

        newCategory.save((err, newcat) => {
            if (err) {
                console.log(err);
            }
        });

        const newBusiness = new Business({
            name: 'hobala26',
            email: 'test@gmail.com',
            shortDescription: 'This item is for testing the Business SignUp API',
            phoneNumbers: ['12345677', '22222222', '32414553'],
            password: 'blahblah1',
            confirmPassword: 'blahblah1',
            description: 'This is for testing the API',
            workingHours: 'Saturday To Thursday 8AM-5PM',
        });
        newBusiness.branches.push(newBranch.id);
        newBusiness.categories.push(newCategory.id);

        newBusiness.save((err, newBuss) => {
            chai.request(app)
                .get('/api/v1/business/' + newBusiness.id)
                .send(newBusiness)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('shortDescription');
                    res.body.should.have.property('description');
                    res.body.should.have.property('workingHours');
                    res.body.should.have.property('branches');
                    res.body.should.have.property('categories');
                    res.body.should.have.property('_id').eql(newBusiness.id);
                    done();
                });

        });
    });

    it('it should not GET a business by the non existence id', (done) => {
        chai.request(app)
            .get('/api/v1/business/' + 4)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
    });
});
