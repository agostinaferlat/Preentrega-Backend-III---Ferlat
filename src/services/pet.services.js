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

    const updatedPet = await this.petDao.update(id, data);

    if (!updatedPet) {
      return null;
    }

    return updatedPet;
  }

  async remove(id) {
    const pet = await this.petDao.getBy(id);
  
    if (!pet) {
      return null;
    }

    await this.petDao.delete(id);
    return true;
  }
}