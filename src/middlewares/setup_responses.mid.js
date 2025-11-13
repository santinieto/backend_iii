const setupResponses = (req, res, next) => {
    try {
        const messages = {
            200: "OK",
            201: "Created",
            204: "No Content",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            500: "Internal Server Error",
        };

        const successResponse = (code, response, message) => {
            return res.status(code).json({
                method: req.method,
                url: req.originalUrl,
                code,
                status: "OK",
                message: message || messages[code],
                response,
            });
        };

        const errorResponse = (code, message) => {
            const error = new Error(message || messages[code]);
            error.status = code || messages[code];
            error.code = code;
            throw error;
        };

        res.json200 = (response, message) => {
            return successResponse(200, response, message);
        };
        res.json201 = (response, message) => {
            return successResponse(201, response, message);
        };
        res.json204 = (response, message) => {
            return successResponse(204, response, message);
        };
        res.json400 = (message) => {
            return errorResponse(400, message);
        };
        res.json401 = (message) => {
            return errorResponse(401, message);
        };
        res.json403 = (message) => {
            return errorResponse(403, message);
        };
        res.json404 = (message) => {
            return errorResponse(404, message);
        };
        res.json500 = (message) => {
            return errorResponse(500, message);
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default setupResponses;
