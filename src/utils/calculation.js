import { getLogger } from "../helpers/logger.helper.js";

const logger = getLogger("calculation");

process.on("message", (message) => {
  let result = 0;
  if (message === "start") {
    logger.info("Child process started calculation");
    for (let i = 0; i < 5e9; i++) {
      result += i;
    }
    process.send(result);
  }
});
