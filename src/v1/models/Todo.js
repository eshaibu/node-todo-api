import mongoose, { Schema } from 'mongoose';
import Validator from 'validatorjs';

const characterLengthMessages = {
  'between.title': 'The title field must be less than 200 characters',
  'between.description': 'The description field must be less than 600 characters',
};

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      Default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Validate before create an item
 * @param {Object} obj The object to perform validation on
 * @return {Validator} The validator object with the specified rules.
 */
TodoSchema.statics.validateCreate = (obj) => {
  const rules = {
    title: 'required|between:1,199',
    description: 'required|between:1,599',
  };
  return new Validator(obj, rules, characterLengthMessages);
};

/**
 * Validate before updating an item
 * @param {Object} obj The object to perform validation on
 * @return {Validator} The validator object with the specified rules.
 */
TodoSchema.statics.validateUpdate = (obj) => {
  const rules = {
    title: 'between:1,199',
    description: 'between:1,599',
    completed: 'boolean',
  };
  return new Validator(obj, rules, characterLengthMessages);
};

export default mongoose.model('Todo', TodoSchema);
