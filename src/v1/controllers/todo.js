import mongoose from 'mongoose';
import Todo from '../models/Todo';
import paginationHelper from '../utils/pagination-helper';

/**
 * Class Todos
 */
export default class Todos {
  /**
   * @param {Object} req - request parameter
   * @param {Object} res - The response object
   * @param {object} next - The callback to the next program handler
   * @param {String} id - The id from the url parameter
   * @return {Object} res
   */
  static async id(req, res, next, id) {
    try {
      const todo = await Todo.findById(id).exec();
      if (todo) {
        req.paramId = id;
        req.todo = todo;
        return next();
      }
      return res.status(404).json({
        message: 'Todo item with not found',
      });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        return res.status(404).json({
          message: 'Todo item with not found',
        });
      }
      return next(error);
    }
  }

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

  /**
   * Get all
   * @param {Object} req - request parameter
   * @param {Object} res - response parameter
   * @param {function} next The callback to the next program handler
   * @returns {Object} - returned response object
   */
  static async list(req, res, next) {
    try {
      const { limit, page, sortBy, sortOrder } = req.query;
      const {
        paginationPage,
        paginationLimit,
        paginationOffset,
        paginationOrder,
      } = paginationHelper(parseInt(limit, 10), parseInt(page, 10), sortBy, sortOrder);

      const todoQuery = Todo.find()
        .collation({ locale: 'en' })
        .sort(paginationOrder)
        .skip(paginationOffset)
        .limit(paginationLimit);

      const [queryResult, totalCount] = await Promise.all([
        todoQuery.exec(),
        Todo.estimatedDocumentCount().exec(),
      ]);

      const paginationMeta = {
        currentPage: paginationPage + 1,
        pageCount: Math.ceil(totalCount / paginationLimit),
        totalCount,
        outputCount: queryResult.length,
        pageSize: paginationLimit,
      };

      return res.status(200).json({
        paginationMeta,
        todos: queryResult,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get one resource
   * @param {Object} req - request parameter
   * @param {Object} res - response parameter
   * @returns {Object} - returned response object
   */
  static async get(req, res) {
    return res.status(200).json(req.todo);
  }
}
