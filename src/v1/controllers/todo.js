import Todo from '../models/Todo';

/**
 * Class Todos
 */
export default class Todos {
  /**
   * Create
   * @param {Object} req - request parameter
   * @param {Object} res - response parameter
   * @param {function} next The callback to the next program handler
   * @returns {Object} - returned response object
   */
  static async create(req, res, next) {
    const { title, description } = req.body;
    const validator = Todo.validateCreate(req.body);
    if (validator.passes()) {
      try {
        const todo = new Todo({
          title,
          description,
        });
        const savedTodo = await todo.save();
        return res.status(201).json(savedTodo);
      } catch (error) {
        return next(error);
      }
    } else {
      return res.status(400).json({
        message: 'There are problems with your input',
        errors: validator.errors.all(),
      });
    }
  }
}
