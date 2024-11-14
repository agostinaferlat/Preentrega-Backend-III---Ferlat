import Users from "../dao/Users.dao.js";
import { customError } from "../errors/custom.error.js";
import mongoose from "mongoose";


export class UserServices {
  constructor() {
    this.userDao = new Users();
  }
  async getAll() {
    const users = await this.userDao.get();
    return users;
  }
  async getById(id) {
      
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw customError.badRequestError(`Invalid user ID format: ${id}`);
    }

    const user = await this.userDao.getBy(id);

    if (!user) {
      throw customError.notFoundError(`A user with ID ${id} doesn't exist`);
    }

    return user;
  }

  async getUserByEmail(email) {
    const user = await this.userDao.getByEmail(email);
    return user;
  }

  async create(data) {
    const user = await this.userDao.save(data);
    return user;
  }

  async createMany(data) {
    const users = await this.userDao.saveMany(data);
    return users;
  }

  async update(id, data) {
    const user = await this.userDao.update(id, data);
    return user;
  }
  async remove(id) {
    const user = await this.userDao.getBy(id);
  
    if (!user) {
      return null;
    }

    await this.userDao.delete(id);
    return true;
  }

}