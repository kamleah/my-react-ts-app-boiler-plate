import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos.todos);

    return (
        <div className='max-w-2xl mx-auto px-0 py-6'>
            <ul className='flex flex-col items-center space-y-3 w-full'>
                {todos.length === 0 ? (
                    <div className="mx-auto bg-blue-50 shadow-lg rounded-lg p-4 text-center w-full">
                        <p className="text-gray-600 text-lg font-semibold">No todos yet!</p>
                        <p className="text-gray-500 mt-2">Start by adding a new todo above.</p>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            completed={todo.completed}
                        />
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodoList;