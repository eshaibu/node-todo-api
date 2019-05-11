import 'dotenv/config';

const { NODE_ENV, BASE_URL, DB_URL, TEST_DB_URL, PORT } = process.env;

const config = {
  development: {
    NODE_ENV: NODE_ENV || 'development',
    PORT: parseInt(PORT, 10) || 8000,
  },
  test: {
    NODE_ENV: NODE_ENV || 'test',
    PORT: parseInt(PORT, 10) || 8000,
  },
  production: {
    NODE_ENV,
    PORT: parseInt(PORT, 10) || 8000,
  },
};

export default config[process.env.NODE_ENV || 'development'];
