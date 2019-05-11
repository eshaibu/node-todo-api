import mongoose from 'mongoose';
import jsLogger from 'js-logger';

import config from '../config/index';

const setupMongoose = () => {
  mongoose.Promise = global.Promise;

  mongoose.connect(config.DB_URL, { useNewUrlParser: true });

  mongoose.connection.on('open', () => {
    jsLogger.info('Mongoose connected to mongo shell.');
  });

  mongoose.connection.on('disconnected', () => {
    jsLogger.info('Mongoose connection to mongo shell disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      jsLogger.info('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });
};

export default setupMongoose;
