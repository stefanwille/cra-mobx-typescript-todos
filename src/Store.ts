import { configure, observable, action, computed } from "mobx";

configure({ enforceActions: "observed" });

export class Todo {
  @observable done: boolean = false;
  @observable text: string = "";

  constructor(done: boolean, text: string) {
    this.done = done;
    this.text = text;
  }

  @action
  setDone(newDone: boolean) {
    this.done = newDone;
  }

  @action
  setText(newText: string) {
    this.text = newText;
  }
}

export class Store {
  @observable todos: Todo[] = ["Buy milk", "Write book", "Sleep"].map(
    text => new Todo(false, text)
  );

  @computed
  get todoCount() {
    return this.todos.length;
  }

  @computed
  get openTodos() {
    return this.todos.filter(todo => !todo.done);
  }

  @computed
  get openTodoCount() {
    return this.openTodos.length;
  }

  @action
  addTodo(todo: Todo) {
    this.todos.push(todo);
  }

  @action
  deleteTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
