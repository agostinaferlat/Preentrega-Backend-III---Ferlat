import { fakerEN_GB as faker } from "@faker-js/faker";

export const generatePetsMock = (amount) => {
  const pets = [];
  for (let i = 0; i < amount; i++) {
    const pet = {
      name: faker.name.firstName(),
      species: faker.animal.type(),
      birthDate: faker.date.past(),
      adopted: false,
      image: faker.image.avatar(),
    };
    pets.push(pet);
  }

  return pets;
};