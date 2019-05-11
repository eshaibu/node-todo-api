import 'dotenv/config';
import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import jsLogger from 'js-logger';

import config from './v1/config/index';
import dbConnect from './v1/utils/db-connect';
import errorHandler from './v1/utils/error-handler';
import routes from './v1/routes/index';

jsLogger.useDefaults();

// Set up express app
const app = express();
const router = express.Router();

// Port configuration
const port = config.PORT;

// Log requests to the console
app.use(logger('dev'));

// Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// connect to database
dbConnect();

routes(router);

app.get('/', (req, res) => res.status(200).send({
  message: 'Visit /api/v1/**',
}));

// API Routes
app.use('/api/v1', router);

// catch 404 and show message
app.get('*', (req, res) => res.status(404).send({
  message: 'This route does not exist. Visit /api/v1/**',
}));

// app error handler
app.use(errorHandler);

// Create server
const server = http.createServer(app);

server.listen(port, () => {
  jsLogger.info(`Server running on port ${port}`);
});

export default server;
