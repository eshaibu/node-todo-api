import todoController from '../controllers/todo';

const routes = (router) => {
  router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to V1 API',
    });
  });

  router.param('id', todoController.id);

  router
    .route('/todos')
    .get(todoController.list)
    .post(todoController.create);

  router.route('/todos/:id').get(todoController.get);
};

export default routes;
