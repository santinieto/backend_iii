import FileSystemManager from "./manager.fs.js";

const petsFilePath = "./data/pets.json";

class PetsManager extends FileSystemManager {
    constructor() {
        super(petsFilePath).ensureFileExists();
    }
}

const petsManager = new PetsManager();
export { petsManager };
