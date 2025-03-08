import React from 'react';
import { AddTodo, TodoList } from '../features';

const TodoPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                Todo List
            </h1>

            {/* AddTodo Component */}
            <AddTodo />

            {/* TodoList Component */}
            <TodoList />
        </div>
    );
};

export default TodoPage;