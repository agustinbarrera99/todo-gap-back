const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    return res.json({
        statusCode: err.statusCode || 500,
        message: `${req.method} ${req.originalUrl} : ${err.message}`,
    })
}

export default errorHandler;

