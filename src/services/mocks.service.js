import { faker } from "@faker-js/faker";
import { createHash } from "../helpers/hash.helper.js";
import UserDTO from "../dto/users.dto.js";
import PetDTO from "../dto/pets.dto.js";
import { Service } from "./base.service.js";

class MocksService extends Service {
    constructor() {
        super();
    }

    async createUsers(nUsers) {
        const users = [];

        for (let i = 0; i < nUsers; i++) {
            const first_name = faker.person.firstName();
            const last_name = faker.person.lastName();
            const email = faker.internet.email({
                firstName: first_name,
                lastName: last_name,
            });
            const password = "coder123"; //faker.internet.password();

            const normalizedRole = faker.helpers.arrayElement([
                "user",
                "admin",
            ]);
            const city = faker.location.city();
            const isVerified = faker.datatype.boolean();

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role: normalizedRole,
                city,
                isVerified,
            };

            const data = new UserDTO(newUser);
            users.push(data);
        }

        return users;
    }

    async createPets(nPets) {
        const pets = [];

        for (let i = 0; i < nPets; i++) {
            const species = faker.helpers.arrayElement([
                "dog",
                "cat",
                "hamster",
                "bird",
                "rabbit",
            ]);

            // Para especies más coherentes
            const name =
                species === "dog"
                    ? faker.animal.dog()
                    : species === "cat"
                    ? faker.animal.cat()
                    : faker.person.firstName();

            const breed =
                species === "dog"
                    ? faker.animal.dog()
                    : species === "cat"
                    ? faker.animal.cat()
                    : null;

            const age = faker.number.int({ min: 1, max: 18 });
            const city = faker.location.city();

            const newPet = {
                name,
                species,
                breed,
                age,
                city,
                owner: null, // si querés, después lo podés asignar a usuarios faker
                isAdopted: faker.datatype.boolean(),
            };

            const data = new PetDTO(newPet);
            pets.push(data);
        }

        return pets;
    }
}

export const mocksService = new MocksService();
