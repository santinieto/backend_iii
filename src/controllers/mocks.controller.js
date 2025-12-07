import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { mocksService } from "../services/mocks.service.js";
import { getLogger } from "../helpers/logger.helper.js";

const logger = getLogger("mocks");

export const createUsers = async (req, res) => {
    logger.debug(
        "Entrando en el controlador de creación de usuarios de prueba"
    );
    const nUsers = Number(req.query.n) || 10;

    const users = await mocksService.createUsers(nUsers);

    res.json201(users, "Usuarios de prueba creados correctamente.");
};

export const createPets = async (req, res) => {
    logger.debug(
        "Entrando en el controlador de creación de usuarios de prueba"
    );
    const nPets = Number(req.query.n) || 10;

    const pets = await mocksService.createPets(nPets);

    res.json201(pets, "Mascotas de prueba creados correctamente.");
};

export const generateData = async (req, res) => {
    logger.debug(
        "Entrando en el controlador de generación de datos de prueba (fork)"
    );

    const nUsers = Number(req.query.users) || 10;
    const nPets = Number(req.query.pets) || 10;

    try {
        // Ejecuta los workers en paralelo
        const [users, pets] = await Promise.all([
            runWorker("users", nUsers),
            runWorker("pets", nPets),
        ]);

        return res.json201(
            { users, pets },
            "Datos de prueba generados correctamente (fork)."
        );
    } catch (err) {
        logger.error("Error generando datos de prueba con fork:", err);
        return res.json500(
            "Error generando datos de prueba: " + (err.message || String(err))
        );
    }
};

const runWorker = (task, n) => {
    return new Promise((resolve, reject) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const workerPath = path.resolve(
            __dirname,
            "../workers/mocks.worker.js"
        );

        const child = fork(workerPath, [], {
            env: process.env,
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        });

        // timeout opcional para no dejar procesos colgados
        const timeoutMs = 30_000;
        const timer = setTimeout(() => {
            child.kill();
            reject(new Error(`Worker ${task} timeout (${timeoutMs}ms)`));
        }, timeoutMs);

        child.on("message", (msg) => {
            clearTimeout(timer);
            if (msg && msg.ok) {
                resolve(msg.data);
            } else {
                reject(new Error(msg?.error || "Error desconocido en worker"));
            }
        });

        child.on("error", (err) => {
            clearTimeout(timer);
            reject(err);
        });

        child.on("exit", (code) => {
            // Si exit sin mensaje, considerarlo error si code!==0
            // (pero normalmente ya resolvimos por message)
            if (code !== 0) {
                logger.warn(`Worker ${task} salió con código ${code}`);
            }
        });

        // enviar instrucción al worker
        child.send({ task, n });
    });
};
