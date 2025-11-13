import FileSystemManager from "./manager.fs.js";

const usersFilePath = "./data/users.json";

class UsersManager extends FileSystemManager {
    constructor() {
        super(usersFilePath).ensureFileExists();
    }
}

const usersManager = new UsersManager();
export { usersManager };
