import { useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import { BASE_URL } from "../services/baseConfig";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `${BASE_URL}image-modifier/remove-bg/`,
        formData,
        {
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to remove background.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadWithProcessedImage = () => {
    if (!processedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = "background_removed.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = processedImage;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Image Background Removal Tool
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
                } transition duration-200`}
            >
              {isLoading ? "Processing..." : "Remove Background"}
            </button>
          </div>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Images Display */}
        {(originalImage || processedImage) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Original Image */}
            {originalImage && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Original Image</h3>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto rounded-md max-h-[400px] object-contain"
                />
                <a
                  href={originalImage}
                  download="original_image.png"
                  className="block mt-4 text-center py-2 px-4 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition duration-200"
                >
                  Download Original
                </a>
              </div>
            )}

            {/* Processed Image (No Background) */}
            {processedImage && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Background Removed</h3>
                <img
                  src={processedImage}
                  alt="Background Removed"
                  className="w-full h-auto rounded-md max-h-[400px] object-contain bg-gray-200"
                />
                <a
                  href={processedImage}
                  download="background_removed.png"
                  className="block mt-4 text-center py-2 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-200"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default RemoveBackground;
