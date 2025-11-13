const pathHandler = (req, res) => {
    const message = "Path not found";
    const data = {
        status: "error",
        method: req.method,
        url: req.originalUrl,
        error: message,
    };
    res.status(404).json(data);
};

export default pathHandler;
