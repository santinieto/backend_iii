import { fork } from "child_process";
import CustomRouter from "../custom.router.js";

class ForksRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.read("/", ["public"], (req, res) => {
      const child = fork("./src/utils/calculation.js");
      child.send("start");
      child.on("message", (result) => {
        res.json200(result);
      });
    });
  };
}

const forksRouter = new ForksRouter().getRouter();

export default forksRouter;
