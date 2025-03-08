import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Todo type
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// Define the state type
interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo(state, action: PayloadAction<string>) {
            const newTodo: Todo = {
                id: Date.now(), // Simple unique ID using timestamp
                text: action.payload,
                completed: false,
            };
            state.todos.push(newTodo);
        },
        toggleTodo(state, action: PayloadAction<number>) {
            const todo = state.todos.find((t) => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo(state, action: PayloadAction<number>) {
            state.todos = state.todos.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;