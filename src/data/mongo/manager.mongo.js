import User from "./models/users.model.js";

class MongoManager {
    constructor(model) {
        this.model = model;
    }
    createOne = async (data) => await this.model.create(data);
    readAll = async (filter) => await this.model.find(filter).lean();
    readBy = async (data) => await this.model.findOne(data).lean();
    readById = async (id) => await this.model.findOne({ _id: id }).lean();
    updateById = async (id, data) =>
        await this.model.findOneAndUpdate({ _id: id }, data, {
            new: true,
            timestamps: true,
        });
    destroyById = async (id) => await this.model.findOneAndDelete({ _id: id });
}

export default MongoManager;

const usersManager = new MongoManager(User);

export { usersManager };
