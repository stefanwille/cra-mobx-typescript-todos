import App from "./App";
import Store from "./Store";

describe("Store", () => {
  it("todoCount", () => {
    const store = new Store();
    expect(store.todoCount).toBe(3);
    store.addTodo({ done: false, text: "Test the store" });
    expect(store.todoCount).toBe(4);
    store.deleteTodo(0);
    expect(store.todoCount).toBe(3);
  });

  it("openTodos", () => {
    const store = new Store();
    expect(store.openTodos.length).toBe(3);
    store.todos.forEach(todo => {
      todo.done = true;
    });
    expect(store.openTodos.length).toBe(0);
  });
});
