import config from '../config/index';

export default (error, req, res) => {
  const response = { message: error.message || 'Error processing request' };
  if (config.NODE_ENV !== 'production') {
    response.developer_message = error;
  }
  return res.status(500).json(response);
};
