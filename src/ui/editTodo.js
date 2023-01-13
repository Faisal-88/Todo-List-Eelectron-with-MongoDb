const { updateStatus, idTodoToUpdate, todoName } = require("./app");

function editTodo(id) {
    updateStatus = true;
    idTodoToUpdate = id;
    const todo = todo.find((todo) => todo._id === id);
    todoName.value = todo.name;
    //   taskDescription.value = task.description;
}
