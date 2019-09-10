import React, { createContext, useContext } from "react";
import "./App.css";
import { Store, Todo } from "./Store";
import { action } from "mobx";
import { observer, useLocalStore } from "mobx-react-lite";

const StoreContext = createContext<Store>(new Store());

const useStore = () => useContext(StoreContext);

interface TodoItemProps {
  todo: Todo;
  index: number;
}

const TodoItem = ({ todo, index }: TodoItemProps) => {
  return (
    <li className="todo">
      <input
        type="checkbox"
        value={todo.done ? 1 : 0}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          todo.setDone(event.target.checked);
        }}
      />
      {todo.text} <DeleteButton index={index} />
    </li>
  );
};

const ListOfTodos = observer(() => {
  const store = useStore();
  return (
    <ol>
      {store.todos.map((todo, index) => {
        return <TodoItem key={index} todo={todo} index={index} />;
      })}
    </ol>
  );
});

const AddTodo = observer(() => {
  const store = useStore();
  const localStore = useLocalStore(() => ({
    text: "New todo",
    setText: action((newText: string) => {
      localStore.text = newText;
    })
  }));
  const submitTodo = action(() => {
    store.addTodo(new Todo(false, localStore.text));
    localStore.text = "New todo";
  });

  return (
    <div>
      <input
        type="text"
        value={localStore.text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          localStore.setText(event.target.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            submitTodo();
          }
        }}
      />{" "}
      <button onClick={submitTodo}>OK</button>
    </div>
  );
});

interface DeleteButtonProps {
  index: number;
}

const DeleteButton = ({ index }: DeleteButtonProps) => {
  const store = useStore();
  return (
    <button
      className="delete-button"
      onClick={() => {
        store.deleteTodo(index);
      }}
    >
      X
    </button>
  );
};

const NumberOfTodos = observer(() => {
  const store = useStore();
  return (
    <div>
      <h5>You have {store.todoCount} Todos</h5>
      <h5>You have {store.openTodoCount} open Todos</h5>
    </div>
  );
});

const TodoList = () => {
  return (
    <React.Fragment>
      <ListOfTodos />
      <NumberOfTodos />
      <AddTodo />
    </React.Fragment>
  );
};

const store = new Store();

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <div className="App">
        <TodoList />
      </div>
    </StoreContext.Provider>
  );
};

export default App;
