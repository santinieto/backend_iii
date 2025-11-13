export class Service {
    constructor(repository) {
        this.repository = repository;
    }

    async readAll() {
        return await this.repository.readAll();
    }

    async readOne(id) {
        return await this.repository.readOne(id);
    }

    async createOne(data) {
        return await this.repository.createOne(data);
    }

    async updateOne(id, data) {
        return await this.repository.updateOne(id, data);
    }

    async deleteOne(id) {
        return await this.repository.deleteOne(id);
    }
}
