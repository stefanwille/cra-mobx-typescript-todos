import React, { createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action, computed, decorate } from 'mobx';
import { observer, useLocalStore } from 'mobx-react-lite';

configure({ enforceActions: 'observed' });

class Todo {
    constructor(done: boolean, text: string) {
        this.done = done;
        this.text = text;
    }

    done = false;
    text = '';

    setDone = action((newDone: boolean) => (this.done = newDone));
}

class Store {
    todos = [ 'Buy milk', 'Write book', 'Sleep' ].map((text) => new Todo(false, text));

    get todoCount() {
        return this.todos.length;
    }

    get openTodos() {
        return this.todos.filter((todo) => !todo.done);
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

const StoreContext = createContext<Store>(new Store());

const useStore = () => useContext(StoreContext);

const AddTodo = observer(() => {
    const store = useStore();
    const localStore = useLocalStore(() => ({
        text: 'New todo',
        setText: action((newText: string) => {
            localStore.text = newText;
        })
    }));
    const submitTodo = () => {
        store.addTodo(new Todo(false, localStore.text));
        localStore.text = 'New todo';
    };

    return (
        <div>
            <input
                type="text"
                value={localStore.text}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    localStore.setText(event.target.value);
                }}
                onKeyPress={action((event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        submitTodo();
                    }
                })}
            />{' '}
            <button onClick={action(submitTodo)}>OK</button>
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
            <h5>You have {store.openTodos.length} open Todos</h5>
        </div>
    );
});

interface TodoProps {
    todo: Todo;
    index: number;
}

const TodoItem = ({ todo, index }: TodoProps) => {
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
