import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { API_IMAGE_URL, BASE_URL } from '../services/baseConfig';

// Interfaces
interface Template {
    id: number;
    name: string;
    image: string;
}

interface TextOption {
    id: number;
    value: string;
    label: string;
}

interface WordCollection {
    id: number;
    name: string;
}

// API Configuration
const API_BASE_URL = `${BASE_URL}/imagemakerapp`;
const TEMPLATES_ENDPOINT = `${API_BASE_URL}/list-templates/`;
const WORDS_ENDPOINT = `${API_BASE_URL}/wordscollections/`;
const GENERATE_IMAGE_ENDPOINT = `${API_BASE_URL}/generate-image/`;

// Custom Hook for Fetching Data
const useApiFetch = <T,>(url: string, errorMessage: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<T>(url);
            setData(response.data);
        } catch (err) {
            const message = err instanceof AxiosError
                ? err.response?.data?.detail || errorMessage
                : errorMessage;
            setError(message);
            console.error(`${errorMessage}:`, err);
        } finally {
            setIsLoading(false);
        }
    }, [url, errorMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

// Component
const ImageGenerator: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedTexts, setSelectedTexts] = useState<TextOption[]>([]);
    const [textColor, setTextColor] = useState<string>('#000000');
    const [colorInput, setColorInput] = useState<string>('#000000');
    const [colorError, setColorError] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    // Fetch templates
    const {
        data: templates,
        isLoading: isTemplatesLoading,
        error: templatesError
    } = useApiFetch<Template[]>(TEMPLATES_ENDPOINT, 'Failed to fetch templates');

    // Fetch word collections
    const {
        data: wordCollections,
        isLoading: isWordsLoading,
        error: wordsError
    } = useApiFetch<WordCollection[]>(WORDS_ENDPOINT, 'Failed to fetch word collections');

    // Transform word collections to TextOption format
    const textOptions = useMemo(() => {
        if (!wordCollections) return [];
        return wordCollections.map(({ id, name }) => ({
            id,
            value: name,
            label: name,
        }));
    }, [wordCollections]);

    // Handlers
    const handleTemplateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = parseInt(e.target.value, 10);
        const template = templates?.find((t) => t.id === templateId) || null;
        setSelectedTemplate(template);
    }, [templates]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (selectedTexts.some((text) => text.value === value) || selectedTexts.length >= 3) return;

        const option = textOptions.find((opt) => opt.value === value);
        if (option) {
            setSelectedTexts((prev) => [...prev, option]);
        }
    }, [selectedTexts, textOptions]);

    const handleTextRemove = useCallback((id: number) => {
        setSelectedTexts((prev) => prev.filter((text) => text.id !== id));
    }, []);

    const isValidColor = useCallback((color: string): boolean => {
        if (!color) return false;
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }, []);

    const handleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextColor(color);
        setColorInput(color);
        setColorError('');
    }, []);

    const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setColorInput(color);

        if (!color) {
            setColorError('Color code cannot be empty');
            return;
        }

        if (isValidColor(color)) {
            setTextColor(color);
            setColorError('');
        } else {
            setColorError('Invalid color code');
        }
    }, [isValidColor]);

    const handleDownload = useCallback(async () => {
        if (!selectedTemplate || selectedTexts.length === 0 || colorError || isDownloading) return;

        setIsDownloading(true);

        try {
            const payload = {
                templateid: selectedTemplate.id,
                text: selectedTexts.map((t) => t.value),
                color: textColor,
            };

            const response = await axios.post(GENERATE_IMAGE_ENDPOINT, payload, {
                responseType: 'blob',
            });

            // Handle JSON error response
            const contentType = response.headers['content-type'];
            if (contentType.includes('application/json')) {
                const errorText = await response.data.text();
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error || 'Failed to generate image');
            }

            // Trigger download
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'custom_template.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            console.error('Download error:', err);
            alert(`Error: ${message}`);
        } finally {
            setIsDownloading(false);
        }
    }, [selectedTemplate, selectedTexts, textColor, colorError, isDownloading]);

    // Render
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-xl font-semibold mb-6 text-center">Create Template</h2>

            {/* Template Dropdown */}
            <div className="mb-4">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Template
                </label>
                {isTemplatesLoading ? (
                    <p className="text-gray-500">Loading templates...</p>
                ) : templatesError ? (
                    <p className="text-red-500 text-sm">{templatesError}</p>
                ) : (
                    <select
                        id="template"
                        onChange={handleTemplateChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        disabled={!templates?.length}
                    >
                        <option value="">--Select Template--</option>
                        {templates?.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Text Selection Dropdown */}
            <div className="mb-4">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Text (Max 3)
                </label>
                {isWordsLoading ? (
                    <p className="text-gray-500">Loading words...</p>
                ) : wordsError ? (
                    <p className="text-red-500 text-sm">{wordsError}</p>
                ) : (
                    <select
                        id="text"
                        onChange={handleTextChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        disabled={!textOptions.length || selectedTexts.length >= 3}
                    >
                        <option value="">--Select Text--</option>
                        {textOptions.map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Text Color Selection */}
            {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Text Color
                </label>
                <div className="flex items-center gap-2">
                    <input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={handleTextColorChange}
                        className="w-10 h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        id="colorCode"
                        type="text"
                        value={colorInput}
                        onChange={handleColorInputChange}
                        placeholder="e.g., #FFFFFF or red"
                        className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${colorError ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </div>
                {colorError && <p className="text-red-500 text-sm mt-1">{colorError}</p>}
            </div> */}

            {/* Selected Text */}
            {selectedTexts.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Selected Text:</h3>
                    <ul className="mt-2 space-y-1">
                        {selectedTexts.map((text) => (
                            <li key={text.id} className="flex justify-between items-center text-gray-600">
                                <span>{text.label}</span>
                                <button
                                    onClick={() => handleTextRemove(text.id)}
                                    className="text-red-500 hover:text-red-600 text-sm transition duration-150"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Image Preview and Download */}
            {selectedTemplate && (
                <div className="mt-6">
                    <div className="relative">
                        <img
                            src={`${API_IMAGE_URL}${selectedTemplate.image}`}
                            alt={selectedTemplate.name}
                            className="w-full rounded-lg shadow-lg"
                            crossOrigin="anonymous"
                        />
                        {selectedTexts.length > 0 && (
                            <div
                                className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold bg-opacity-50 rounded"
                                style={{ color: textColor }}
                            >
                                {selectedTexts.map((t) => t.value).join(' | ')}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || !!colorError || !selectedTemplate || selectedTexts.length === 0}
                        className={`mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg transition duration-150 ${isDownloading || colorError || !selectedTemplate || selectedTexts.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-green-700'
                            }`}
                    >
                        {isDownloading ? 'Generating...' : 'Download Image'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;