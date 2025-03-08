import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from './todoSlice';
import { AppDispatch } from '../../redux/store';
import { Button } from '../../components';
import { CheckCircle, Circle, Trash2 } from '../../components/icon';

interface TodoItemProps {
    id: number;
    text: string;
    completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed }) => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <li
            className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg rounded-xl mb-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full ${completed ? 'opacity-80 from-gray-50 to-gray-100' : ''
                }`}
        >
            {/* Checkbox and Text */}
            <div className="flex items-center space-x-4 w-full">

                <button
                    onClick={() => dispatch(toggleTodo(id))}
                    className="focus:outline-none"
                >
                    {completed ? (
                        <CheckCircle
                            className="w-6 h-6 text-indigo-500 transition-transform duration-200 hover:scale-110"
                            strokeWidth={2}
                        />
                    ) : (
                        <Circle
                            className="w-6 h-6 text-gray-400 transition-transform duration-200 hover:scale-110 hover:text-indigo-400"
                            strokeWidth={2}
                        />
                    )}
                </button>

                <span
                    className={`text-base text-gray-700 font-medium break-words flex-1 ${completed ? 'line-through text-gray-500' : ''
                        }`}
                >
                    {text}
                </span>

            </div>

            {/* Delete Button */}
            <Button
                onClick={() => dispatch(removeTodo(id))}
                color="red"
                size="md"
                className="px-2! py-2!"
            >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
            </Button>
        </li>
    );
};

export default TodoItem;