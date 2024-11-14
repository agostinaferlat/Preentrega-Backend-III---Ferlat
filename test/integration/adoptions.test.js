import { expect } from "chai";
import supertest from "supertest";

const adoptionRequest = supertest("http://localhost:8080/api/adoptions");
const userRequest = supertest("http://localhost:8080/api/users");
const petRequest = supertest("http://localhost:8080/api/pets");
const sessionRequest = supertest("http://localhost:8080/api/sessions")


describe("Test de integración Adoptions", () => {
    let userTest;
    let petTest;
    let adoptionTest;

    it("[POST] /api/sessions/register - Debe registrar un usuario", async () =>{
        const newUser = {
            first_name: "Lucas",
            last_name: "Pardo",
            email: "lucas.p@gmail.com",
            password: "maytheforce91",
        };

        const { status, body } = await sessionRequest.post("/register").send(newUser);
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
            email: "lucas.p@gmail.com",
            password: "maytheforce91",
        };
        const { status, body } = await sessionRequest.post("/login").send(data);
       
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.message).to.be.a("string");
    });

    it("[POST] /api/pets - Debe crear una nueva mascota", async () =>{
        const newPet = {
            name: "Baldo",
            species: "perro",
            birthDate: "09/06/2021",
            image: "imagenbaldo",
        };
        const { status, body } = await petRequest.post("/").send(newPet);
        petTest = body.payload;
        expect(status).to.be.equal(201);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.be.equal("Baldo");
        expect(body.payload.species).to.be.equal("perro");
        expect(body.payload.adopted).to.be.equal(false);
    });

    it("[POST] /api/adoptions/:uid/:pid - Debe realizar una adopción", async () => {
        const { status, body } = await adoptionRequest.post(`/${userTest._id}/${petTest._id}`).send();
    
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.message).to.equal("Pet adopted");

        adoptionTest = body.payload;
    });
    
    it("[POST] /api/adoptions/:uid/:pid - Debe fallar si la mascota ya ha sido adoptada", async () => {
        const { status, body } = await adoptionRequest.post(`/${userTest._id}/${petTest._id}`).send();
    
        expect(status).to.equal(400);
        expect(body.status).to.equal("error");
        expect(body.error).to.equal("Pet has already been adopted");
    });
    
    it("[GET] /api/adoptions - Debe devolver todas las adopciones", async () => {
        const { status, body } = await adoptionRequest.get("/");
    
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.payload).to.be.an("array");
    });
    
    it("[GET] /api/adoptions/:aid - Debe devolver una adopción específica", async () => {

        const { status, body } = await adoptionRequest.get(`/${adoptionTest._id}`);
    
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.payload).to.be.an("object");
        expect(body.payload.pet).to.equal(petTest._id);
    });
    
    it("[GET] /api/adoptions/:aid - Debe devolver 404 si no se encuentra la adopción", async () => {
        const invalidAdoptionId = "invalidAdoptionId";
    
        const { status, body } = await adoptionRequest.get(`/${invalidAdoptionId}`);
  
        expect(status).to.equal(400);
        expect(body.status).to.equal("error");
        expect(body.error).to.equal("Invalid Adoption ID");
    });
    
    after(async () => {
        if (adoptionTest && adoptionTest._id) {
            await adoptionRequest.delete(`/${adoptionTest._id}`);
        }
        await userRequest.delete(`/${userTest._id}`);
        await petRequest.delete(`/${petTest._id}`);   

    });


})
