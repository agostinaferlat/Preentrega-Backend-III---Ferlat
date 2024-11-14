import { expect } from "chai";
import supertest from "supertest";


const request = supertest("http://localhost:8080/api/sessions");
const userRequest = supertest("http://localhost:8080/api/users");

describe("Test de integración Sessions", () => {
    let userTest;

    it("[POST] /api/sessions/register - Debe registrar un usuario", async () =>{
        const newUser = {
            first_name: "Ana",
            last_name: "Russo",
            email: "anirusso56@gmail.com",
            password: "russoA2156"
        };

        const { status, body } = await request.post("/register").send(newUser);
        userTest = body.payload;

        expect(status).to.equal(201);
        expect(body.status).to.equal("success");
        expect(body.payload).to.be.an("object");
        expect(body.payload.email).to.equal(newUser.email);
        expect(body.payload.first_name).to.equal(newUser.first_name);
        expect(body.payload.last_name).to.equal(newUser.last_name);
        expect(body.payload.password).to.not.equal(newUser.password);
    });

    it("[POST] /api/sessions/login - Debe iniciar sesión de un usuario", async () =>{
        const data = {
            email: "anirusso56@gmail.com",
            password: "russoA2156"
        };
        const { status, body } = await request.post("/login").send(data);
       
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.message).to.be.a("string");
    });

   after(async () => {
        await userRequest.delete(`/${userTest._id}`)
    });

});