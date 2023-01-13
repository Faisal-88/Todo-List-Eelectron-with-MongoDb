const { BrowserWindow, ipcMain } = require("electron");
const Todo = require("./models/Todo");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: false,
  });

  win.loadFile("src/index.html");
}

ipcMain.on("new-todo", async (e, arg) => {
  const newTodo = new Todo(arg);
  const todoSaved = await newTodo.save();
  e.reply("new-todo-created", JSON.stringify(todoSaved));
});

ipcMain.on("get-todos", async (e, arg) => {
  const todos = await Todo.find();
  e.reply("get-todos", JSON.stringify(todos));
});

ipcMain.on("delete-todo", async (e, args) => {
  const todoDeleted = await Todo.findByIdAndDelete(args);
  e.reply("delete-todo-success", JSON.stringify(todoDeleted));
});

ipcMain.on("update-todo", async (e, args) => {
  console.log(args);
  const updatedTodo = await Todo.findByIdAndUpdate(
    args.idTodoToUpdate,
    { name: args.name },
    { new: true }
  );
  e.reply("update-todo-success", JSON.stringify(updatedTodo));
});

module.exports = { createWindow };
