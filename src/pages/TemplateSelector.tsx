// TemplateSelector.tsx
import React, { useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { API_IMAGE_URL, BASE_URL } from '../services/baseConfig';

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

const TemplateSelector: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedTexts, setSelectedTexts] = useState<TextOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [textColor, setTextColor] = useState<string>('#FFFFFF'); // Default to white
    const [colorInput, setColorInput] = useState<string>('#FFFFFF'); // Text input value
    const [colorError, setColorError] = useState<string>('');

    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Dummy text options for dropdown
    const textOptions: TextOption[] = [
        { id: 1, value: 'Text1', label: 'Text 1' },
        { id: 2, value: 'Text2', label: 'Text 2' },
        { id: 3, value: 'Text3', label: 'Text 3' },
        { id: 4, value: 'Text4', label: 'Text 4' },
        { id: 5, value: 'Text5', label: 'Text 5' },
    ];

    // Fetch template list from API
    const fetchTemplates = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/imagemakerapp/list-templates/`);
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    // Handle template selection
    const handleTemplateChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateId = parseInt(e.target.value);
        const template = templates.find((t) => t.id === selectedTemplateId);
        setSelectedTemplate(template || null);
    };

    // Handle text selection (max 3)
    const handleTextChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedTexts.some((text) => text.value === selectedValue)) return; // Prevent duplicates
        if (selectedTexts.length < 3) {
            const selectedOption = textOptions.find((option) => option.value === selectedValue);
            if (selectedOption) {
                setSelectedTexts([...selectedTexts, selectedOption]);
            }
        }
    };

    // Handle text removal
    const handleTextRemove = (id: number) => {
        setSelectedTexts(selectedTexts.filter((text) => text.id !== id));
    };

    // Validate color
    const isValidColor = (color: string): boolean => {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    };

    // Handle text color change (via color picker)
    const handleTextColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setTextColor(newColor);
        setColorInput(newColor);
        setColorError('');
    };

    // Handle text color code input
    const handleColorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColorInput(newColor);

        if (newColor === '') {
            setColorError('Color code cannot be empty');
            return;
        }

        if (isValidColor(newColor)) {
            setTextColor(newColor);
            setColorError('');
        } else {
            setColorError('Invalid color code');
        }
    };

    // Handle download (generate the image with text overlay)
    const handleDownload = () => {
        if (!imgRef.current || !canvasRef.current || selectedTexts.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const text = selectedTexts.map((t) => t.value).join(' | ');
            ctx.font = '24px Arial';
            ctx.fillStyle = textColor; // Use selected text color
            ctx.textAlign = 'right';
            ctx.fillText(text, canvas.width - 100, 100);

            try {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return;
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'custom_template.png';
                        a.click();
                        URL.revokeObjectURL(url);
                    },
                    'image/png'
                );
            } catch (error) {
                console.error('Failed to export canvas:', error);
                alert('Unable to download image due to security restrictions. Please try again or contact support.');
            }
        }
    };

    // Load templates on mount
    React.useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-xl font-semibold mb-6 text-center">Create Template</h2>

            {/* Template Dropdown */}
            <div>
                <label htmlFor="template" className="block text-sm font-medium mb-1">
                    Select Template
                </label>
                <select
                    id="template"
                    onChange={handleTemplateChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">--Select Template--</option>
                    {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Text Selection Dropdown */}
            <div className="mt-4">
                <label htmlFor="text" className="block text-sm font-medium mb-1">
                    Select Text (Max 3)
                </label>
                <select
                    id="text"
                    onChange={handleTextChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">--Select Text--</option>
                    {textOptions.map((option) => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Text Color Selection */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Select Text Color</label>
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
                        placeholder="Enter color (e.g., #FFFFFF or red)"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${colorError ? 'border-red-500' : ''
                            }`}
                    />
                </div>
                {colorError && <p className="text-red-500 text-sm mt-1">{colorError}</p>}
            </div>

            {/* Selected Text */}
            <div className="mt-4">
                <h3 className="text-sm font-medium">Selected Text:</h3>
                <ul>
                    {selectedTexts.map((text) => (
                        <li key={text.id} className="flex justify-between items-center">
                            <span>{text.label}</span>
                            <button
                                type="button"
                                onClick={() => handleTextRemove(text.id)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Image Preview and Download Button */}
            {selectedTemplate && (
                <div className="relative mt-8">
                    <img
                        ref={imgRef}
                        src={`${API_IMAGE_URL}${selectedTemplate.image}`}
                        alt={selectedTemplate.name}
                        crossOrigin="anonymous"
                        className="w-full rounded-lg shadow-lg"
                    />

                    <canvas ref={canvasRef} className="hidden" />

                    {/* Text Preview */}
                    {selectedTexts.length > 0 && (
                        <div
                            className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold"
                            style={{ color: textColor }} // Apply selected text color
                        >
                            {selectedTexts.map((t) => t.value).join(' | ')}
                        </div>
                    )}

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        disabled={!!colorError} // Disable if invalid color
                        className={`mt-4 bg-green-600 text-white px-4 py-2 rounded-lg transition ${colorError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                            }`}
                    >
                        Download Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default TemplateSelector;