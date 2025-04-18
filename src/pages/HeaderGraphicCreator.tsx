import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import LinkedInNavbar from '../components/header/LinkedInNavbar';
import { API_IMAGE_URL, BASE_URL } from '../services/baseConfig';

// Interfaces
interface Template {
    id: number;
    name: string;
    image: string;
}

interface Word {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    words: Word[];
}

// API Configuration
const API_BASE_URL = `${BASE_URL}/imagemakerapp`;
const TEMPLATES_ENDPOINT = `${API_BASE_URL}/list-templates/`;
const WORDS_ENDPOINT = `${API_BASE_URL}/wordscollections-grouped-by-category/`;
const GENERATE_IMAGE_ENDPOINT = `${API_BASE_URL}/generate-image/`;

// Custom Hook for Fetching Data
const useApiFetch = <T,>(url: string, initialData: T | null = null, errorMessage: string) => {
    const [data, setData] = useState<T | null>(initialData);
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

// Modal Component
const KeywordSelectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (selected: Word[]) => void;
    setSelectedTexts: React.Dispatch<React.SetStateAction<Word[]>>;
    categories: Category[];
    selectedTexts: Word[];
}> = ({ isOpen, onClose, onSave, setSelectedTexts, categories, selectedTexts }) => {
    const [category, setCategory] = useState<string>('All');
    const [filteredWords, setFilteredWords] = useState<Word[]>([]);

    useEffect(() => {
        if (category === 'All') {
            const allWords = categories.flatMap((cat) => cat.words);
            setFilteredWords(allWords);
        } else {
            const selectedCategory = categories.find((cat) => cat.name === category);
            setFilteredWords(selectedCategory?.words || []);
        }
    }, [category, categories]);

    const handleSave = () => {
        onSave(selectedTexts);
        onClose();
    };

    const handleCheckboxChange = useCallback((option: Word, checked: boolean) => {
        if (checked && selectedTexts.length < 3) {
            setSelectedTexts((prev) => [...prev, option]);
        } else if (!checked) {
            setSelectedTexts((prev) => prev.filter((t) => t.id !== option.id));
        }
    }, [selectedTexts, setSelectedTexts]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Choose Keywords</h3>
                {/* <div className="mb-4">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4">
                    {filteredWords.map((option) => (
                        <div key={option.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`keyword-${option.id}`}
                                checked={selectedTexts.some((s) => s.id === option.id)}
                                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                                disabled={selectedTexts.length >= 3 && !selectedTexts.some((s) => s.id === option.id)}
                                className="mr-2"
                            />
                            <label htmlFor={`keyword-${option.id}`} className="text-sm">{option.name}</label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Selected Keywords Component
const SelectedKeywordsList: React.FC<{
    selectedTexts: Word[];
    onRemove: (id: number) => void;
}> = ({ selectedTexts, onRemove }) => {
    if (selectedTexts.length === 0) {
        return (
            <div className="text-gray-500 italic">
                No keywords selected
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {selectedTexts.map((word) => (
                <div key={word.id} className="bg-[#FDB495] text-black px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">{word.name}</span>
                    <button
                        onClick={() => onRemove(word.id)}
                        className="text-black hover:text-black"
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
    );
};

// Preview Modal Component
const PreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    template: Template | null;
    selectedTexts: Word[];
    textColor: string;
}> = ({ isOpen, onClose, template, selectedTexts, textColor }) => {
    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Preview Your Design</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
                <div className="relative">
                    <img
                        src={`${API_IMAGE_URL}${template.image}`}
                        alt={template.name}
                        className="w-full rounded-lg shadow-lg"
                        crossOrigin="anonymous"
                    />
                    {selectedTexts.length > 0 && (
                        <div
                            className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold bg-opacity-50 rounded text-capitalize"
                            style={{ color: textColor }}
                        >
                            {selectedTexts.map((t) => t.name).join(' | ')}
                        </div>
                    )}
                    <div className="p-4 relative">
                        {/* Profile Picture */}
                        <div className="absolute -top-20 left-8">
                            <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-gray-500 text-2xl font-bold">
                                JP
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const HeaderGraphicCreator: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedTexts, setSelectedTexts] = useState<Word[]>([]);
    const [textColor, setTextColor] = useState<string>('#000000');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

    // Fetch templates
    const { data: templates, isLoading: isTemplatesLoading, error: templatesError } =
        useApiFetch<Template[]>(TEMPLATES_ENDPOINT, null, 'Failed to fetch templates');

    // Fetch word collections with categories
    const { data: wordCollections, isLoading: isWordsLoading, error: wordsError } =
        useApiFetch<Category[]>(WORDS_ENDPOINT, null, 'Failed to fetch word collections');

    // Handlers
    const handleTemplateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = parseInt(e.target.value, 10);
        const template = templates?.find((t) => t.id === templateId) || null;
        setSelectedTemplate(template);
    }, [templates]);

    const handleRemoveKeyword = useCallback((id: number) => {
        setSelectedTexts((prev) => prev.filter((word) => word.id !== id));
    }, []);

    const handlePreview = useCallback(() => {
        if (selectedTemplate && selectedTexts.length > 0) {
            setIsPreviewModalOpen(prev => !prev);
        } else {
            alert('Please select a template and at least one keyword to preview');
        }
    }, [selectedTemplate, selectedTexts]);

    const handleDownload = useCallback(async () => {
        if (!selectedTemplate || isDownloading) return;

        setIsDownloading(true);
        try {
            const payload = {
                templateid: selectedTemplate.id,
                text: selectedTexts.map((t) => t.name),
                color: textColor,
            };

            const response = await axios.post(GENERATE_IMAGE_ENDPOINT, payload, {
                responseType: 'blob',
            });

            let fileName = 'download.png';
            const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];

            if (contentDisposition) {
                const match = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="?([^"]+)"?/);
                if (match) {
                    fileName = decodeURIComponent(match[1] || match[2]);
                }
            }

            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Download error:', err);
            alert('Error: Unable to generate image');
        } finally {
            setIsDownloading(false);
        }
    }, [selectedTemplate, selectedTexts, textColor, isDownloading]);

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Step 1: Select Template */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-2">Select a template (Step 1)</h2>
                        {isTemplatesLoading ? (
                            <p>Loading templates...</p>
                        ) : templatesError ? (
                            <p className="text-red-500">{templatesError}</p>
                        ) : (
                            <select
                                onChange={handleTemplateChange}
                                disabled={!templates?.length}
                                className="w-full border rounded-lg px-4 py-2">
                                <option value="">--Select Template--</option>
                                {templates?.map((template) => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Step 2: Choose Keywords */}
                    <div className='mt-5'>
                        <h2 className="text-lg font-medium text-gray-700 mb-2">Choose keywords (Step 2)</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#FF5101] text-white px-4 py-2 rounded-lg mb-4">
                            Click to choose
                        </button>

                        {/* Selected Keywords List */}
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Keywords ({selectedTexts.length}/3):</h3>
                            <SelectedKeywordsList
                                selectedTexts={selectedTexts}
                                onRemove={handleRemoveKeyword}
                            />
                        </div>

                        {/* Preview Button */}
                        {/* <button
                            onClick={handlePreview}
                            disabled={!selectedTemplate}
                            className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-150 mt-4 ${!selectedTemplate
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-600'
                                }`}>
                            Preview
                        </button> */}
                    </div>

                    {/* Step 3: Choose Text Color */}
                    {/* <div className="mt-5">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">Choose text color (Step 3)</h2>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full h-10 cursor-pointer"
                        />
                    </div> */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md relative lg:col-span-2">

                    {selectedTemplate ? (
                        <>
                            <h2 className="text-lg font-medium text-gray-700 mb-2">Preview</h2>
                            <LinkedInNavbar />
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
                                            className="absolute top-5 right-4 px-4 bg-opacity-50 rounded text-capitalize"
                                            style={{ color: textColor, fontFamily: 'ITCCharterCom', fontSize: 20 }}
                                        >
                                            {selectedTexts.map((t) => t.name).join(' | ')}
                                        </div>
                                    )}
                                    {<div className="p-4 relative">
                                        {/* Profile Picture */}
                                        <div className="absolute -top-28 left-8">
                                            <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-gray-500 text-2xl font-bold">
                                                JP
                                            </div>
                                        </div>
                                    </div>}
                                </div>

                                <div className={`${!isPreviewModalOpen ? "mt-8" : "mt-4"} flex gap-4`}>
                                    {/* Download Button */}
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading || !selectedTemplate}
                                        className={`bg-[#FF5101] text-white px-4 py-2 rounded-lg transition duration-150 ${isDownloading || !selectedTemplate
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-[#FF5101]'
                                            }`}>
                                        {isDownloading ? 'Generating...' : 'Download Image'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-64 bg-gray-100 rounded-lg">
                            <p className="text-gray-500 text-center">
                                Select a template and keywords to preview your design
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Keyword Selection Modal */}
            <KeywordSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={setSelectedTexts}
                setSelectedTexts={setSelectedTexts}
                categories={wordCollections || []}
                selectedTexts={selectedTexts}
            />

            {/* Preview Modal */}
            {/* <PreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                template={selectedTemplate}
                selectedTexts={selectedTexts}
                textColor={textColor}
            /> */}
        </div>
    );
};

export default HeaderGraphicCreator;