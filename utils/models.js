class Todo {
  constructor(name, desc) {
    this.created = Date.now();
    this.id = "todo-" + this.created;
    this.name = name;
    this.description = desc;
    this.done = false;
  }
}

class TodoList {
  constructor(title) {
    this.created = Date.now();
    this.id = "list-" + this.created;
    this.title = title;
    this.todos = [];
  }
}
