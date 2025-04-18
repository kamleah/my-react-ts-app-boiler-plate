import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Header } from "../components";
import { BASE_URL } from "../services/baseConfig";

type WordsCollectionType = {
  id: number;
  name: string;
  category: { id: number; name: string };
};

type CategoryType = {
  id: number;
  name: string;
};

const WordsCollections: React.FC = () => {
  const [wordsCollections, setWordsCollections] = useState<WordsCollectionType[]>([]);
  const [inputName, setInputName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Base API
  const BASE_URLS = `${BASE_URL}/imagemakerapp/wordscollections/`;
  const CATEGORIES_URL = `${BASE_URL}/imagemakerapp/categories/`;

  // Fetch all collections
  const fetchWordsCollections = async () => {
    try {
      const response = await axios.get(BASE_URLS);
      setWordsCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIES_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Create new collection
  const createWordsCollection = async () => {
    if (!inputName.trim()) return;
    try {
      setErrorMessage(""); // Clear previous errors
      await axios.post(BASE_URLS, { name: inputName, category_id: 1 });
      setInputName("");
      setSelectedCategoryId(null);
      fetchWordsCollections();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.name && Array.isArray(errorData.name)) {
          setErrorMessage(errorData.name[0]); // e.g., "words collection with this name already exists."
        } else {
          setErrorMessage("Failed to create collection.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Error creating collection:", error);
    }
  };

  // Update collection
  const updateWordsCollection = async () => {
    if (!editId || !inputName.trim()) return;
    try {
      setErrorMessage(""); // Clear previous errors
      await axios.put(`${BASE_URLS}${editId}/`, { name: inputName, category_id: 1 });
      setEditId(null);
      setInputName("");
      setSelectedCategoryId(null);
      fetchWordsCollections();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.name && Array.isArray(errorData.name)) {
          setErrorMessage(errorData.name[0]); // e.g., "words collection with this name already exists."
        } else {
          setErrorMessage("Failed to update collection.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Error updating collection:", error);
    }
  };

  // Delete collection
  const deleteWordsCollection = async (id: number) => {
    try {
      await axios.delete(`${BASE_URLS}${id}/`);
      fetchWordsCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  // Handle Edit button click
  const startEditing = (id: number, name: string, categoryId: number) => {
    setEditId(id);
    setInputName(name);
    setSelectedCategoryId(categoryId);
    setErrorMessage(""); // Clear error when starting edit
  };

  // Handle Cancel
  const cancelEdit = () => {
    setEditId(null);
    setInputName("");
    setSelectedCategoryId(null);
    setErrorMessage(""); // Clear error on cancel
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
    setErrorMessage(""); // Clear error when typing
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(Number(e.target.value));
    setErrorMessage(""); // Clear error when category is selected
  };

  useEffect(() => {
    fetchWordsCollections();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Header>{editId ? "Edit Keyword" : "Add New Keyword"}</Header>

          {/* Single Form for Create or Edit */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                value={inputName}
                onChange={handleInputChange}
                placeholder={editId ? "Edit keyword name" : "Enter new keyword name"}
              />
              {/* <select
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedCategoryId ?? ""}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select> */}
              {editId ? (
                <>
                  <button
                    className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:opacity-50"
                    onClick={updateWordsCollection}
                    disabled={!inputName.trim()}
                  >
                    Update
                  </button>
                  <button
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 focus:outline-none transition-all duration-200"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
                  onClick={createWordsCollection}
                  disabled={!inputName.trim()}
                >
                  Create
                </button>
              )}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Collections List in Table Format */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Keywords List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold rounded-tl-xl">Name</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold">Category</th> */}
                  <th className="px-6 py-4 text-left text-sm font-semibold rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wordsCollections.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-gray-500 text-center py-6">No collections yet</td>
                  </tr>
                ) : (
                  wordsCollections.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-indigo-100 transition-all duration-300`}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-medium">
                        {item.name}
                      </td>
                      {/* <td className="px-6 py-4 border-b border-gray-200 text-gray-600">
                        {item.category.name}
                      </td> */}
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-600">
                        <div className="flex gap-2">
                          <button
                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                            onClick={() => deleteWordsCollection(item.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 text-sm"
                            onClick={() => startEditing(item.id, item.name, item.category.id)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordsCollections;