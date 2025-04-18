// src/components/AddCategoryForm.tsx
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Card, Header, LoadingButton } from '../../components';
import { apiEndPoints } from '../../services/apiEndPoints';

interface Category {
    id: number;
    name: string;
}

interface AddCategoryFormProps {
    editCategory?: Category | null;
    onSuccess: (category: Category) => void;
    onCancel?: () => void;
}

interface FormData {
    name: string;
}

const API_TIMEOUT = 10000;

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ editCategory, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: { name: '' },
    });

    // Set form values when editing
    useEffect(() => {
        if (editCategory) {
            setValue('name', editCategory.name);
        } else {
            reset();
        }
    }, [editCategory, setValue, reset]);

    const onSubmit = useCallback(
        async (data: FormData) => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                let response;
                if (editCategory) {
                    // Update existing category
                    response = await axios.put<Category>(
                        `${apiEndPoints.categories}${editCategory.id}/`,
                        { name: data.name },
                        { timeout: API_TIMEOUT }
                    );
                } else {
                    // Create new category
                    response = await axios.post<Category>(
                        apiEndPoints.categories,
                        { name: data.name },
                        { timeout: API_TIMEOUT }
                    );
                }
                onSuccess(response.data);
                if (!editCategory) reset();
            } catch (error) {
                const err = error as AxiosError;
                setErrorMessage(
                    err.response?.status === 400
                        ? 'Category name already exists or is invalid.'
                        : err.response?.status === 500
                            ? 'Server error. Please try again later.'
                            : 'Failed to save category.'
                );
                console.error('API error:', err.message, err.response?.data);
            } finally {
                setIsLoading(false);
            }
        },
        [editCategory, onSuccess, reset]
    );

    return (
        <Card>
            <Header>{editCategory ? 'Edit Category' : 'Add New Category'}</Header>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <div className="flex items-start gap-4">
                        <div className="flex-[0.8] flex flex-col">
                            <input
                                type="text"
                                {...register('name', {
                                    required: 'Category name is required.',
                                    maxLength: {
                                        value: 50,
                                        message: 'Category name must be under 50 characters.'
                                    },
                                    validate: (value) => value.trim() !== '' || 'Category name cannot be empty.'
                                })}
                                className={`w-full p-2 border rounded-lg focus:outline-none ${
                                    errors.name || errorMessage 
                                        ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                } transition-all duration-200`}
                                placeholder={editCategory ? 'Edit category name' : 'Enter new category name'}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex flex-[0.2] gap-2 self-start">
                            <LoadingButton
                                isLoading={isLoading}
                                type="submit"
                                text={editCategory ? 'Update' : 'Create'}
                                activeClassName="bg-blue-600 hover:bg-blue-700"
                                disabledClassName="bg-gray-400 cursor-not-allowed"
                            />
                            {editCategory && onCancel && (
                                <LoadingButton
                                    isLoading={isLoading}
                                    onClick={onCancel}
                                    text="Cancel"
                                    activeClassName="bg-gray-400 hover:bg-gray-500"
                                    disabledClassName="bg-gray-300 cursor-not-allowed"
                                    type="button"
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Field validation error message */}
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-2 pl-1 w-[80%]">{errors.name.message}</p>
                    )}
                </div>
                
                {/* API error message */}
                {errorMessage && (
                    <div className="flex items-center text-red-500 text-sm bg-red-100 p-3 rounded">
                        <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L9.586 10l-2.293 2.293a1 1 0 101.414 1.414L11 11.414l2.293 2.293a1 1 0 001.414-1.414L12.414 10l2.293-2.293a1 1 0 00-1.414-1.414L11 8.586 8.707 6.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default AddCategoryForm;