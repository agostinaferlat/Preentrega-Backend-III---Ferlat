import { customError, CustomError } from "../errors/custom.error.js";
import { UserServices } from "../services/user.services.js";
import mongoose from "mongoose";

export class UserControllers {
  constructor() {
    this.userServices = new UserServices();
  }

  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userServices.getAll();
      res.send({ status: "success", payload: users });
    } catch (error) {
      console.error(`Error fetching all users: ${error.message}`);
      res.status(500).send({ status: "error", error: "Internal server error" });
    }
  };

  getUser = async (req, res, next) => {
    try {
      const userId = req.params.uid;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "error", error: "Invalid user ID format" });
      }

      const user = await this.userServices.getById(userId);

      return res.status(200).send({status: "success", data: user});
    } catch (error) {
      
      console.error("Error fetching user:", error);

      const status = error.status || error.statusCode;
      if (status) {
        return res.status(status).send({
          status: "error",
          error: error.message,
        });
      }
    
      return res.status(500).send({
        status: "error",
        error: "Internal server error",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const updateBody = req.body;
      const userId = req.params.uid;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "error", error: "Invalid user ID format" });
      }

      const user = await this.userServices.getById(userId);
      if (!user){
        return res.status(404).send({ status: "error", error: "User not found" });
      }
      
      const result = await this.userServices.update(userId, updateBody);
      res.send({ status: "success", message: "User updated" });
    
    } catch (error) {

      console.error(`Error updating user: ${error.message}`);
      res.status(500).send({ status: "error", error: "Internal server error" });
    
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.params.uid;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
          status: "error",
          error: "Invalid user ID format",
        });
      }
  
      const result = await this.userServices.remove(userId);
  
      if (!result) {
        return res.status(404).send({  status: "error", error: "User not found",});
      }
  
      return res.status(200).send({
        status: "success",
        message: "User deleted",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        status: "error",
        error: "Internal server error",
      });
    }
  };
};