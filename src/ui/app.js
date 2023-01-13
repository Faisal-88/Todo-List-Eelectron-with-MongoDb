const { ipcRenderer } = require("electron");

const todoForm = document.querySelector("#todoForm");
const todoName = document.querySelector("#todoName");
const todoList = document.querySelector("#todoList");

let updateStatus = false;
let idTodoToUpdate = "";

function deleteTodo(id) {
    const response = confirm("yakin ingin menghapus data?");
    if (response) {
        ipcRenderer.send("delete-todo", id);
    }
    return;
}

function editTodo(id) {
    updateStatus = true;
    idTodoToUpdate = id;
    const todo = todos.find((todo) => todo._id === id);
    todoName.value = todo.name;
}

function renderTodos(todos) {
    todoList.innerHTML = "";
    todos.map((t) => {
        todoList.innerHTML += `
          <li class="card">
            <h4>
              Todo id: ${t._id}
            </h4>
            <p>
              Todo Name: ${t.name}
            </p>    
            <input type="checkbox" id="cek">
            <button class="btn btn-danger" onclick="deleteTodo('${t._id}')">
              🗑 Delete
            </button>
            <button class="btn btn-secondary" onclick="editTodo('${t._id}')">
              ✎ Edit
            </button>
          </li>
        `;

        const someCheckbox = document.getElementById('cek');
        someCheckbox.addEventListener('change', e => {
            if (e.target.checked === true) {
                console.log("Checkbox is checked - boolean value: ", e.target.checked)
            }
            if (e.target.checked === false) {
                console.log("Checkbox is not checked - boolean value: ", e.target.checked)
            }
        });


    });
}


let todos = [];

ipcRenderer.send("get-todos");

todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const todo = {
        name: todoName.value,
    };

    if (!updateStatus) {
        ipcRenderer.send("new-todo", todo);
    } else {
        ipcRenderer.send("update-todo", { ...todo, idTodoToUpdate });
    }

    todoForm.reset();
});

ipcRenderer.on("new-todo-created", (e, arg) => {
    console.log(arg);
    const todoSaved = JSON.parse(arg);
    todos.push(todoSaved);
    console.log(todos);
    renderTodos(todos);
    alert("To do List successfully");
    todoName.focus();
});

ipcRenderer.on("get-todos", (e, args) => {
    const receivedTodos = JSON.parse(args);
    todos = receivedTodos;
    renderTodos(todos);
});

ipcRenderer.on("delete-todo-success", (e, args) => {
    const deletedTodo = JSON.parse(args);
    const newTodos = todos.filter((t) => {
        return t._id !== deletedTodo._id;
    });
    todos = newTodos;
    renderTodos(todos);
});

ipcRenderer.on("update-todo-success", (e, args) => {
    updateStatus = false;
    const updatedTodo = JSON.parse(args);
    todos = todos.map((t, i) => {
        if (t._id === updatedTodo._id) {
            t.name = updatedTodo.name;

        }
        return t;
    });
    renderTodos(todos);
});
