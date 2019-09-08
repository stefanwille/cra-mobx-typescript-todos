import React, { createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action, computed, decorate } from 'mobx';
import { observer, useLocalStore } from 'mobx-react-lite';

configure({ enforceActions: 'observed' });

class Store {
    todos = [ 'Buy milk', 'Write book' ];

    get todoCount() {
        return this.todos.length;
    }

    addTodo(todo: string) {
        this.todos.push(todo);
    }

    deleteTodo(index: number) {
        this.todos.splice(index, 1);
    }
}

decorate(Store, {
    todos: observable,
    todoCount: computed,
    addTodo: action,
    deleteTodo: action
});

const StoreContext = createContext<Store>(new Store());

const useStore = (): Store => useContext(StoreContext);

const AddTodo = observer(() => {
    const store = useStore();
    const localStore = useLocalStore(() => ({
        text: 'New todo'
    }));
    const submitTodo = () => {
        store.addTodo(localStore.text);
        localStore.text = 'New todo';
    };

    return (
        <div>
            <input
                type="text"
                value={localStore.text}
                onChange={action((event: React.ChangeEvent<HTMLInputElement>) => {
                    localStore.text = event.target.value;
                })}
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
    return <h5>You have {store.todoCount} Todos</h5>;
});

const ListOfTodos = observer(() => {
    const store = useStore();
    return (
        <ol>
            {store.todos.map((todo, index) => (
                <li key={index} className="todo">
                    {todo} <DeleteButton index={index} />
                </li>
            ))}
        </ol>
    );
});

const TodoList = () => {
    return (
        <div>
            <ListOfTodos />
            <NumberOfTodos />
            <AddTodo />
        </div>
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
