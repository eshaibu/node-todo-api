import 'dotenv/config';

const { NODE_ENV, DB_URL, PORT } = process.env;

const config = {
  development: {
    NODE_ENV: NODE_ENV || 'development',
    DB_URL: DB_URL || 'mongodb://localhost/todo_dev',
    PORT: parseInt(PORT, 10) || 8000,
  },
  test: {
    NODE_ENV: NODE_ENV || 'test',
    DB_URL: DB_URL || 'mongodb://localhost/todo_test',
    PORT: parseInt(PORT, 10) || 8000,
  },
  production: {
    NODE_ENV,
    DB_URL,
    PORT: parseInt(PORT, 10) || 8000,
  },
};

export default config[process.env.NODE_ENV || 'development'];
