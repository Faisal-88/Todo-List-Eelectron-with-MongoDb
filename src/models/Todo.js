const { model, Schema } = require("mongoose");

const newTodoSchema = new Schema({
  name: {
    type: String,
    required: true,
  }

});

module.exports = model("Todo", newTodoSchema);
