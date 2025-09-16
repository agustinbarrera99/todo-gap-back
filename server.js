import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './src/middlewares/errorHandler.js';
import pathHandler from './src/middlewares/pathHandler.js';
import indexRouter from './src/routers/indexRouter.js';
import dbConnection from './src/utils/dbConnection.js';
import "dotenv/config";

const server = express();
const PORT = process.env.PORT || 8080;
server.use(cors());

const ready = () => {
    console.log(`Server ready on port ${PORT}`);
    dbConnection();
}

server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.listen(PORT, ready);

server.use('/api', indexRouter);
server.use(pathHandler);
server.use(errorHandler);





