import Users from "../../src/dao/Users.dao.js";
import mongoose from "mongoose";
import { expect } from "chai";

mongoose.connect("mongodb://localhost:27017/adoptionwebsite");

describe("Test UserDao", () => {
  const userDao = new Users();
  let userTest;

  before(() => {
    console.log("Inicio de todos los tests");
  });

  beforeEach(() => {
    console.log("Se ejecuta un test individual");
  });

  it("Debe retornar todos los usuarios", async () => {
    const users = await userDao.get();
    expect(users).to.be.an("array");
    expect(users).to.be.not.an("object");
  });

  it("Debe crear y retornar un usuario", async () => {
    const newUser = {
      first_name: "Carlos",
      last_name: "Riganti",
      email: "friganti@gmail.com",
      password: "12345",
      age: 30,
      birthDate: new Date(),
    };

    const user = await userDao.save(newUser);
    userTest = user;

    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.be.equal(newUser.first_name);
    expect(user.last_name).to.be.equal(newUser.last_name);
    expect(user.email).to.be.equal(newUser.email);
    expect(user.password).to.be.equal(newUser.password);
    expect(user.role).to.be.equal("user");

    expect(user).to.not.have.property("age");
    expect(user).to.not.have.property("birthDate");
    expect(user).to.not.be.null;
    expect(user).to.not.be.an("array");
  });

  it("Debe retornar un usuario por su id", async () => {
    const user = await userDao.getBy(userTest._id);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.equal(userTest.first_name);
    expect(user.last_name).to.equal(userTest.last_name);
    expect(user.email).to.equal(userTest.email);
    expect(user.password).to.equal(userTest.password);
  });

  it("Debe actualizar un usuario", async () => {
    const updateData = {
      first_name: "Fran",
      password: "54321",
    };

    const user = await userDao.update(userTest._id, updateData);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.equal("Fran");
    expect(user.last_name).to.equal(userTest.last_name);
    expect(user.email).to.equal(userTest.email);
    expect(user.password).to.equal("54321");
  });

  it("Debe eliminar el usuario", async () => {
    await userDao.delete(userTest._id);
    const user = await userDao.getBy(userTest._id);
    expect(user).to.be.null;
  })

  afterEach(() => {
    console.log("Test individual finalizado");
  });

  after(async () => {
    console.log("Tests finalizados");
    mongoose.disconnect();
  });
});