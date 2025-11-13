import { Router } from "express";
import setupResponses from "../middlewares/setup_responses.mid.js";
import setupPolicies from "../middlewares/setup_policies.mid.js";

class CustomRouter {
    constructor() {
        this.router = Router();
        this.use(setupResponses);
    }

    getRouter() {
        return this.router;
    }

    applyMiddleware = (cbs) => {
        return cbs.map((cb) => async (req, res, next) => {
            try {
                await cb(req, res, next);
            } catch (error) {
                next(error);
            }
        });
    };

    create = (path, policies, ...cbs) => {
        this.router.post(
            path,
            setupPolicies(policies),
            this.applyMiddleware(cbs)
        );
    };

    read = (path, policies, ...cbs) => {
        this.router.get(
            path,
            setupPolicies(policies),
            this.applyMiddleware(cbs)
        );
    };

    update = (path, policies, ...cbs) => {
        this.router.put(
            path,
            setupPolicies(policies),
            this.applyMiddleware(cbs)
        );
    };

    delete = (path, policies, ...cbs) => {
        this.router.delete(
            path,
            setupPolicies(policies),
            this.applyMiddleware(cbs)
        );
    };

    use = (path, ...cbs) => {
        this.router.use(path, this.applyMiddleware(cbs));
    };

    param = (paramName, cb) => {
        this.router.param(paramName, cb);
    };
}

export default CustomRouter;
