import mongoose, { Schema } from 'mongoose';
import Validator from 'validatorjs';

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
  return new Validator(obj, rules);
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
  return new Validator(obj, rules);
};

export default mongoose.model('Todo', TodoSchema);
