import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './todoSlice';
import { AppDispatch } from '../../redux/store';
import { Button, Input } from '../../components';


const AddTodo: React.FC = () => {
    const [text, setText] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            dispatch(addTodo(text));
            setText('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg rounded-xl max-w-2xl mx-auto transition-all duration-300 hover:shadow-xl">
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new todo" />
            <Button text="Add" type="submit" color="indigo" size="lg" />
        </form>
    );
};

export default AddTodo;