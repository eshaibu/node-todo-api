const routes = (router) => {
  router.get('/', (req, res) => {
    res.json({
      status: 'Welcome to V1 API',
    });
  });
};

export default routes;
