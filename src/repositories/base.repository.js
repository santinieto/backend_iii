export default class BaseRepository {
    constructor({ manager, DTO = null, createFn, updateFn }) {
        this.manager = manager;
        this.DTO = DTO;
        this.createFn = createFn;
        this.updateFn = updateFn;
    }

    async createOne(data) {
        const payload = this.DTO ? new this.DTO(data) : data;
        return await this.createFn.call(this.manager, payload);
    }

    async readAll() {
        return await this.manager.readAll();
    }

    async readOne(id) {
        return await this.manager.readById(id);
    }

    async updateOne(id, data) {
        return await this.updateFn.call(this.manager, id, data);
    }

    async deleteOne(id) {
        return await this.manager.destroyById(id);
    }
}
