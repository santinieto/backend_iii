import { mocksService } from "../services/mocks.service.js";

// El worker espera un mensaje con { task: "users"|"pets", n: number }
process.on("message", async (msg) => {
    try {
        if (!msg || !msg.task) {
            throw new Error("Mensaje inválido al worker");
        }

        if (msg.task === "users") {
            const users = await mocksService.createUsers(msg.n || 10);
            process.send({ ok: true, task: "users", data: users });
        } else if (msg.task === "pets") {
            const pets = await mocksService.createPets(msg.n || 10);
            process.send({ ok: true, task: "pets", data: pets });
        } else {
            throw new Error("Tarea no reconocida: " + msg.task);
        }
    } catch (err) {
        process.send({
            ok: false,
            error: err.message || String(err),
            task: msg?.task,
        });
    } finally {
        process.exit();
    }
});
