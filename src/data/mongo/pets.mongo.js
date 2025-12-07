import MongoManager from "./manager.mongo.js";
import Pets from "./models/pets.model.js";

class PetsManager extends MongoManager {
    constructor() {
        super(Pets);
    }
}

const petsManager = new PetsManager();
export { petsManager };
