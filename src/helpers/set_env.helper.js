import { config } from "dotenv";
import args from "./set_args.helper.js";

const path = `./.env.${args.env}`;

config({
    path,
});

const env = {
    ENV: args.env,
    PORT: args.port || 8080,
    COOKIE_KEY: process.env.COOKIE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
};

export default env;
