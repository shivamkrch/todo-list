var todoList = [];

const listContainer = document.querySelector("#list-container");
const addListBtn = document.querySelector(".add-list-btn");
const modal = document.querySelector(".modal");
const addListModal = document.querySelector(".add-list-modal");
const addTodoForm = document.querySelector("#todo-form");
const addListForm = document.querySelector("#add-list-form");

function getListDiv(list) {
  let newListDiv = document.createElement("div");
  newListDiv.className = "list";
  newListDiv.id = list.id;
  newListDiv.ondragover = e => e.preventDefault();
  newListDiv.ondrop = drop;
  let listTitle = document.createElement("h4");
  listTitle.className = "list-title";
  listTitle.innerHTML = `${list.title} <span class="todo-count">${list.todos.length}</span> <small
            ><i class="fas fa-pen edit-btn" title="Edit list title"></i
            ><i class="far fa-trash-alt cursor-pointer" title="Delete list"
            onclick="deleteList(event, '${list.id}')"></i>
            <i class="fas fa-plus add-todo-btn" title="Add todo" onclick="openModal('add', '${list.id}')"></i
          ></small>`;
  let todosDiv = document.createElement("div");
  todosDiv.className = "todos";
  newListDiv.append(listTitle, todosDiv);
  return newListDiv;
}

function getTodoDiv(todo, listId) {
  let newTodoDiv = document.createElement("div");
  newTodoDiv.innerHTML = `<small>
            <i class="far ${
              todo.done ? "fa-thumbs-down" : "fa-thumbs-up"
            } cursor-pointer" title="${
    todo.done ? "Set undone" : "Set done"
  }" onclick="updateTodoStatus(event,'${listId}','${
    todo.id
  }', ${!todo.done})"></i>
            <i class="far fa-trash-alt cursor-pointer" title="Delete todo" onclick="deleteTodo(event,'${listId}', '${
    todo.id
  }')"></i>
          </small>`;
  newTodoDiv.className = "todo " + (todo.done ? "done" : "");
  newTodoDiv.id = todo.id;
  newTodoDiv.draggable = true;
  newTodoDiv.ondragstart = drag;
  if (!todo.done) {
    newTodoDiv.title = "Click to view and edit";
    newTodoDiv.onclick = openModal.bind(this, "edit", listId, todo.id);
  } else {
    newTodoDiv.style.cursor = "not-allowed";
  }
  let todoName = document.createElement("h4");
  todoName.className = "todo-name";
  todoName.textContent = todo.name;
  let todoDesc = document.createElement("p");
  todoDesc.className = "description";
  todoDesc.textContent = todo.description;
  newTodoDiv.append(todoName, todoDesc);
  return newTodoDiv;
}

function deleteList(e, listId) {
  todoList = todoList.filter(list => list.id !== listId);
  const targetListDiv = document.getElementById(listId);
  targetListDiv.onanimationend = e => {
    e.target.remove();
  };
  targetListDiv.style.animation = "fade-out .5s 1 ease-out";
}

function addTodo(list_id, todo) {
  let targetList = todoList.find(list => list.id === list_id);
  targetList.todos.unshift(todo);
  const targetListDiv = document.getElementById(list_id);
  targetListDiv.lastChild.prepend(getTodoDiv(todo, list_id));
  targetListDiv.firstChild.children[0].textContent = targetList.todos.length;
}

function updateTodo(list_id, todo_id, todoName, todoDesc) {
  let targetList = todoList.find(list => list.id === list_id);
  let i = targetList.todos.findIndex(todo => todo.id === todo_id);
  targetList.todos[i] = new Todo(todoName, todoDesc);
  const targetTodoDiv = document.getElementById(todo_id);
  targetTodoDiv.replaceWith(getTodoDiv(targetList.todos[i], list_id));
}

function updateTodoStatus(e, list_id, todo_id, status) {
  e.cancelBubble = true;
  let targetList = todoList.find(list => list.id === list_id);
  let targetTodo = targetList.todos.find(todo => todo.id === todo_id);
  targetTodo.done = status;
  const targetTodoDiv = document.getElementById(todo_id);
  targetTodoDiv.replaceWith(getTodoDiv(targetTodo, targetList.id));
}

function deleteTodo(e, list_id, todo_id) {
  e.cancelBubble = true;
  let targetList = todoList.find(list => list.id === list_id);
  targetList.todos = targetList.todos.filter(todo => todo.id !== todo_id);
  const targetTodoDiv = document.getElementById(todo_id);
  targetTodoDiv.onanimationend = e => {
    e.target.remove();
    const targetListDiv = document.getElementById(list_id);
    targetListDiv.firstChild.children[0].textContent = targetList.todos.length;
  };
  targetTodoDiv.style.animation = "fade-out .5s 1 ease-out";
}

function openAddListForm() {
  addListModal.removeAttribute("hidden");
  addListBtn.onclick = closeAddListModal;
  addListBtn.style["transform"] = "rotate(45deg)";
}

function closeAddListModal(e) {
  addListModal.setAttribute("hidden", "");
  addListBtn.onclick = openAddListForm;
  addListBtn.style["transform"] = "rotate(0deg)";
  addListForm.reset();
}

function openModal(type, list_id, todo_id = null) {
  let list = todoList.find(list => list.id === list_id);
  if (type === "add") {
    document.querySelector(
      "#modal-title"
    ).innerHTML = `Add TODO to <span class="list-name">${list.title}</span>`;
    addTodoForm.elements[2].value = "Add";
  } else if (type === "edit") {
    document.querySelector(
      "#modal-title"
    ).innerHTML = `Edit TODO in <span class="list-name">${list.title}</span>`;
    let todo = list.todos.find(todo => todo.id === todo_id);
    addTodoForm.elements[0].value = todo.name;
    addTodoForm.elements[1].value = todo.description;
    addTodoForm.elements[2].value = "Update";
    addTodoForm.setAttribute("target-todo", todo_id);
  }
  addTodoForm.setAttribute("type", type);
  addTodoForm.setAttribute("target-list", list_id);
  addTodoForm.elements[0].focus();
  modal.removeAttribute("hidden");
}

function closeModal(e) {
  // e.preventDefault();
  modal.setAttribute("hidden", "");
  addTodoForm.reset();
  addTodoForm.removeAttribute("type");
  addTodoForm.removeAttribute("target-list");
  addTodoForm.removeAttribute("target-todo");
}

function renderTodos(todos, parent) {
  for (todo of todos) {
    parent.append(getTodoDiv(todo, parent.parentElement.id));
  }
}

function renderList(list) {
  let newListDiv = getListDiv(list);
  listContainer.appendChild(newListDiv);
  if (list.todos.length) {
    renderTodos(list.todos, newListDiv.children[1]);
  }
}

function drag(e) {
  // console.log(e);
  e.dataTransfer.setData("fromList", e.target.parentElement.parentElement.id);
  e.dataTransfer.setData("targetTodo", e.target.id);
}

function drop(e) {
  e.preventDefault();
  let fromList = e.dataTransfer.getData("fromList");
  let targetTodo = e.dataTransfer.getData("targetTodo");
  let toList, targetDiv;
  if (e.target.classList.contains("list")) {
    targetDiv = e.target.lastChild;
    toList = e.target.id;
  } else if (e.target.classList.contains("todos")) {
    targetDiv = e.target;
    toList = e.target.parentElement.id;
  }
  if (fromList === toList) {
    return;
  }
  targetDiv.prepend(document.getElementById(targetTodo));
  fromList = todoList.find(list => list.id === fromList);
  toList = todoList.find(list => list.id === toList);
  targetTodo = fromList.todos.findIndex(todo => todo.id === targetTodo);
  toList.todos.unshift(fromList.todos[targetTodo]);
  fromList.todos.splice(targetTodo, 1);
}

window.onload = () => {
  todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  for (list of todoList) {
    renderList(list);
  }

  addTodoForm.onsubmit = e => {
    e.preventDefault();
    let type = e.target.getAttribute("type");
    let listId = e.target.getAttribute("target-list");
    let todoId = e.target.getAttribute("target-todo");
    let todoName = e.target.elements[0].value;
    let todoDesc = e.target.elements[1].value;
    if (type === "add") {
      addTodo(listId, new Todo(todoName, todoDesc));
    } else if (type === "edit") {
      updateTodo(listId, todoId, todoName, todoDesc);
    }
    e.target.reset();
    closeModal();
  };

  addListForm.onsubmit = e => {
    e.preventDefault();
    let title = e.target.elements[0].value;
    let newList = new TodoList(title);
    todoList.push(newList);
    listContainer.appendChild(getListDiv(newList));
    addListForm.reset();
    closeAddListModal();
  };
};

window.onunload = () => {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};
