import PetDTO from "../dto/Pet.dto.js";
import __dirname from "../utils/index.js";
import mongoose from "mongoose";

import { PetServices } from "../services/pet.services.js";

export class PetsController {
  constructor() {
    this.petService = new PetServices();
  }

  getAllPets = async (req, res, next) => {
    try {
      const pets = await this.petService.getAll();
      res.status(200).json({ status: "success", payload: pets });
    } catch (error) {
      next(error);
    }
  };

  createPet = async (req, res, next) => {
    try {
      const { name, species, birthDate } = req.body;
      if (!name || !species || !birthDate) return res.status(400).send({ status: "error", error: "Incomplete values" });
      const pet = PetDTO.getPetInputFrom({ name, species, birthDate });
      const result = await this.petService.create(pet);
      res.status(201).json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };

  updatePet = async (req, res) => {
    try {
      const petId = req.params.pid;
      const updateData = req.body;

  
      if (!mongoose.Types.ObjectId.isValid(petId)) {
        return res.status(400).send({
          status: "error",
          error: "Invalid pet ID format",
        });
      }
  
      const pet = await this.petService.getById(petId);
  
      const updatedPet = await this.petService.update(petId, updateData);

      if (!updatedPet) {
        return res.status(404).send({
          status: "error",
          error: "Pet not found",
        });
      }
  
      return res.status(200).send({
        status: "success",
        message: "Pet updated",
        payload: updatedPet,
      });
    } catch (error) {
      console.error("Error updating pet:", error.message);
      return res.status(500).send({
        status: "error",
        error: "Internal server error",
      });
    }
  };

  deletePet = async (req, res) => {
    try {
      const petId = req.params.pid;
  
      if (!mongoose.Types.ObjectId.isValid(petId)) {
        return res.status(400).send({
          status: "error",
          error: "Invalid pet ID format",
        });
      }
  
      const result = await this.petService.remove(petId);
  
      if (!result) {
        return res.status(404).send({  status: "error", error: "Pet not found",});
      }
  
      return res.status(200).send({
        status: "success",
        message: "Pet deleted",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        status: "error",
        error: "Internal server error",
      });
    }
  };

  createPetWithImage = async (req, res, next) => {
    try {
      const file = req.file;
      const { name, species, birthDate } = req.body;
      if (!name || !species || !birthDate) return res.status(400).send({ status: "error", error: "Incomplete values" });
      console.log(file);
      const pet = PetDTO.getPetInputFrom({
        name,
        species,
        birthDate,
        image: `${__dirname}/../public/img/${file.filename}`,
      });
      console.log(pet);
      const result = await this.petService.create(pet);
      res.send({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };
}