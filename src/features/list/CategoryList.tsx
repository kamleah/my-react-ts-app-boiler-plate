// src/components/CategoryList.tsx
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Card, FullPageSpinner, Paragraph, SubHeader } from '../../components';
import AddCategoryForm from '../forms/AddCategoriesForm';
import { apiEndPoints } from '../../services/apiEndPoints';

interface Category {
    id: number;
    name: string;
};

interface ApiResponse {
    data: Category[];
};

const API_TIMEOUT = 10000;

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(apiEndPoints.categories, {
                timeout: API_TIMEOUT,
            });
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            const err = error as AxiosError;
            console.error('Fetch error:', err.message, err.response?.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        setIsLoading(true);
        try {
            await axios.delete(`${apiEndPoints.categories}${id}/`, { timeout: API_TIMEOUT });
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (error) {
            const err = error as AxiosError;
            console.error('Delete error:', err.message, err.response?.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSuccess = useCallback(
        (category: Category) => {
            setCategories((prev) =>
                editCategory
                    ? prev.map((cat) => (cat.id === category.id ? category : cat))
                    : [...prev, category]
            );
            setEditCategory(null);
        },
        [editCategory]
    );

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <>
            <AddCategoryForm
                editCategory={editCategory}
                onSuccess={handleSuccess}
                onCancel={() => setEditCategory(null)}
            />
            <Card>
                <SubHeader>Categories List</SubHeader>
                {isLoading && <FullPageSpinner />}
                {!isLoading && categories.length === 0 && <Paragraph>No categories yet</Paragraph>}

                {!isLoading && categories.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold rounded-tl-xl">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-purple-50 transition-all duration-300 even:bg-gray-100"
                                    >
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                                            {category.id}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 text-sm"
                                                    onClick={() => setEditCategory(category)}
                                                    disabled={isLoading}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                                                    onClick={() => deleteCategory(category.id)}
                                                    disabled={isLoading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </Card>
        </>
    );
};

export default CategoryList;