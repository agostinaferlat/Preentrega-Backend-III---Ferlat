import { expect } from "chai";
import supertest from "supertest";


const request = supertest("http://localhost:8080/api/pets");

describe("Test de integración Pets", () => {
    let testPet;

    it("[GET] /api/pets - Debe devolver un array de mascotas", async () =>{
        const { status, body } = await request.get("/")
        expect(status).to.be.equal(200);
        expect(body.payload).to.be.an("array");
    });

    it("[POST] /api/pets - Debe crear una nueva mascota", async () =>{
        const newPet = {
            name: "Pet test",
            species: "gato",
            birthDate: "11/11/2023",
            image: "imagengato",
        };
        const { status, body } = await request.post("/").send(newPet);
        testPet = body.payload;
        expect(status).to.be.equal(201);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.be.equal("Pet test");
        expect(body.payload.species).to.be.equal("gato");
        expect(body.payload.adopted).to.be.equal(false);
    });

    it("[PUT] /api/pets/:pid - Debe actualizar una mascota", async () =>{
        const newPet = {
            name: "Pet test2",
            species: "perro",
        };
        const { status, body } = await request.put(`/${testPet._id}`).send(newPet);
        expect(status).to.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.be.equal("Pet test2");
        expect(body.payload.species).to.equal("perro");
    });

    it("[DELETE] /api/pets/:pid - Debe remover una mascota", async () =>{

        const { status, body } = await request.delete(`/${testPet._id}`);
        
        expect(status).to.equal(200);
        expect(body.message).to.equal("Pet deleted");
    })



})