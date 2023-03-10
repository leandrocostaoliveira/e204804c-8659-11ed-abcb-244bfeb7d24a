const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

describe("get /contracts/:id", ()=>{
    test("get contract by id without authorization", async ()=>{
        await request.get('/contracts/3').expect(401);
    });

    test("should not get contract of other user", async ()=>{
        await request.get('/contracts/3')
            .set('profile_id', '1')
            .expect(403);
    });

    test("get contract by id", async ()=>{
        const resp = await request.get('/contracts/1')
            .set('profile_id', '5')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(resp.body).toBeTruthy();
        expect(resp.body.id).toBe(1);
        expect(resp.body.terms).toBe('bla bla bla');
        expect(resp.body.status).toBe('terminated');
        expect(resp.body.ClientId).toBe(1);
        expect(resp.body.ContractorId).toBe(5);
    });
});

describe("get /contracts", ()=>{
    test("get /contracts without authorization", async ()=>{
        await request.get('/contracts').expect(401);
    });

    test("get a list of contracts", async ()=>{
        const resp = await request.get('/contracts')
            .set('profile_id', '6')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(resp.body).toBeTruthy();
        expect(Array.isArray(resp.body)).toBe(true);
        expect(resp.body.length).toBe(3);
        resp.body.forEach( contract => {
            expect(contract.ClientId==6 || contract.ContractorId==6).toBe(true);
        });
    });

    test("get a list of contracts - profile without any non terminated contracts", async ()=>{
        const resp = await request.get('/contracts')
            .set('profile_id', '5')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(resp.body).toBeTruthy();
        expect(Array.isArray(resp.body)).toBe(true);
        expect(resp.body.length).toBe(0);
    });
});