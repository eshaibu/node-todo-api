import todoController from '../controllers/todo';

const routes = (router) => {
  router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to V1 API',
    });
  });

  router.param('todoId', todoController.todoId);

  router
    .route('/todos')
    .get(todoController.list)
    .post(todoController.create);

  router
    .route('/todos/:todoId')
    .get(todoController.get)
    .patch(todoController.update)
    .delete(todoController.remove);
};

export default routes;
