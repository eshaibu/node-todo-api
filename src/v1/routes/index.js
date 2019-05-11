const routes = (router) => {
  router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to V1 API',
    });
  });
};

export default routes;
