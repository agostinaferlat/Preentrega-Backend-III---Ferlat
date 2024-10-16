import Pet from "../dao/Pets.dao.js";
import { customError } from "../errors/custom.error.js";

export class PetServices {
  constructor() {
    this.petDao = new Pet();
  }
  async getAll() {
    const pets = await this.petDao.get();
    return pets;
  }
  async getById(id) {
    const pet = await this.petDao.getBy(id);
    if (!pet) throw customError.notFoundError(`A pet with the ID ${id} doesn't exist`);
    return pet;
  }

  async create(data) {
    const pet = await this.petDao.save(data);
    return pet;
  }
  async createMany(data) {
    const pets = await this.petDao.saveMany(data);
    return pets;
  }

  async update(id, data) {
    const pet = await this.petDao.update(id, data);
    return pet;
  }

  async remove(id) {
    await this.petDao.delete(id);
    return "ok";
  }
}