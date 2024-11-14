import Adoption from "../dao/Adoption.js";

export class AdoptionServices {
  constructor() {
    this.adoptionDao = new Adoption();
  }
  async getAll() {
    const adoptions = await this.adoptionDao.get();
    return adoptions;
  }
  async getById(id) {
    
    const adoption = await this.adoptionDao.getBy(id);
    if (!adoption) throw customError.notFoundError(`Adoption ID ${id} not found`); 
    return adoption;
  }

  async create(data) {
    const adoption = await this.adoptionDao.save(data);
    return adoption;
  }

  async update(id, data) {
    const adoption = await this.adoptionDao.update(id, data);
    return adoption;
  }

  async remove(id) {
    const result = await this.adoptionDao.delete(id);

    if (!result) {
      throw new Error ("Adoption not found");
    }

    return "ok";
  }
}