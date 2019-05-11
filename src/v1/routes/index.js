import todoController from '../controllers/todo';

const routes = (router) => {
  router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to V1 API',
    });
  });

  router.route('/todos').post(todoController.create);
};

export default routes;
