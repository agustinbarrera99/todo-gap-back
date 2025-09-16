const pathHandler = (req, res, next) => {
    console.error(`${req.method} ${req.originalUrl} : Path not found`);
    return res.json({
        statusCode: 404,
        message: `${req.method} ${req.originalUrl} : Path not found`,
    });
}

export default pathHandler;

