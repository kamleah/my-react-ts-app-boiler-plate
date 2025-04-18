import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/baseConfig';

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post(`${BASE_URL}/imagemakerapp/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Uploaded successfully!');
      console.log(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Upload an Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Upload
          </button>
        </form>
        {preview && (
          <div className="mt-6 text-center">
            <p className="mb-2 text-gray-700 font-medium">Image Preview:</p>
            <img src={preview} alt="Preview" className="rounded-lg shadow-md w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
