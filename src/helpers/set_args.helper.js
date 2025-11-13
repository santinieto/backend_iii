import { Command } from "commander";

const args = new Command();

args.option("--port <port>", "Port to run the server on", 8080);
args.option("--env <env>", "Environment [dev/tst/prd]", "prd");

args.parse();

export default args.opts();
