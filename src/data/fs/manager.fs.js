import { promises as fs } from "fs";
import path from "path";

class FileSystemManager {
    constructor(filePath = "./data/users.json") {
        this.filePath = filePath;
    }

    // Crear archivo si no existe
    ensureFileExists = async () => {
        const dir = path.dirname(this.filePath);
        try {
            await fs.mkdir(dir, { recursive: true }); // Crea el directorio si no existe
            await fs.access(this.filePath); // Verifica si el archivo existe
        } catch (err) {
            if (err.code === "ENOENT") {
                await fs.writeFile(this.filePath, "[]", "utf-8"); // Crea archivo vacío si no existe
            } else {
                throw err;
            }
        }
    };

    // Leer todos los datos
    readAll = async () => {
        try {
            const content = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(content);
        } catch (err) {
            if (err.code === "ENOENT") return []; // Archivo no existe
            throw err;
        }
    };

    // Leer un elemento por propiedad
    readBy = async (filter) => {
        const data = await this.readAll();
        return data.find((item) =>
            Object.entries(filter).every(([key, value]) => item[key] === value)
        );
    };

    // Leer por ID
    readById = async (id) => {
        return this.readBy({ _id: id });
    };

    // Crear nuevo elemento
    createOne = async (newData) => {
        const data = await this.readAll();
        data.push(newData);
        await this.saveAll(data);
        return newData;
    };

    // Actualizar por ID
    updateById = async (id, updates) => {
        const data = await this.readAll();
        const index = data.findIndex((item) => item._id === id);
        if (index === -1) return null;
        data[index] = { ...data[index], ...updates };
        await this.saveAll(data);
        return data[index];
    };

    // Eliminar por ID
    destroyById = async (id) => {
        let data = await this.readAll();
        const index = data.findIndex((item) => item._id === id);
        if (index === -1) return null;
        const [removed] = data.splice(index, 1);
        await this.saveAll(data);
        return removed;
    };

    // Guardar todos los datos
    saveAll = async (data) => {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    };
}

export default FileSystemManager;
