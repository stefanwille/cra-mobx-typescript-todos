import { configure, observable, action, computed, decorate } from 'mobx';

configure({ enforceActions: 'observed' });

interface Todo {
    done: boolean;
    text: string;
}

class Store {
    todos: Todo[] = [ 'Buy milk', 'Write book', 'Sleep' ].map((text) => ({
        done: false,
        text
    }));

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

export default Store;
