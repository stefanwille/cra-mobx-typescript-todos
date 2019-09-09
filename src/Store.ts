import { configure, observable, action, computed, decorate } from "mobx";

configure({ enforceActions: "observed" });

export class Todo {
  constructor(public done: boolean, public text: string) {}

  setDone(newDone: boolean) {
    this.done = newDone;
  }

  setText(newText: string) {
    this.text = newText;
  }
}

decorate(Todo, {
  done: observable,
  text: observable,
  setDone: action,
  setText: action
});

export class Store {
  todos: Todo[] = ["Buy milk", "Write book", "Sleep"].map(
    text => new Todo(false, text)
  );

  get todoCount() {
    return this.todos.length;
  }

  get openTodos() {
    return this.todos.filter(todo => !todo.done);
  }

  addTodo(todo: Todo) {
    this.todos.push(todo);
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
  }
}

decorate(Store, {
  todos: observable,
  todoCount: computed,
  openTodos: computed,
  addTodo: action,
  deleteTodo: action
});
