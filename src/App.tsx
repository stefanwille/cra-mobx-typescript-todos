import React, { createContext, useContext } from 'react';
import './App.css';
import Store from './Store'
import { configure, action} from 'mobx';
import { observer, useLocalStore } from 'mobx-react-lite';

configure({ enforceActions: 'observed' });

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
        store.addTodo({ done: false, text: localStore.text });
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
                onChange={action((event: React.ChangeEvent<HTMLInputElement>) => {
                    todo.done = event.target.checked;
                })}
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
