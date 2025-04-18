import { useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import Draggable, { DraggableData, DraggableEventHandler } from "react-draggable";
import { BASE_URL } from "../services/baseConfig";

// Define the types for the image processing states
interface ImageState {
  x: number;
  y: number;
}

const GradientBackground = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gradientStart, setGradientStart] = useState<string>("#4f46e5");
  const [gradientEnd, setGradientEnd] = useState<string>("#9333ea");
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [textBgColor, setTextBgColor] = useState<string>("#000000");
  const [textBgOpacity, setTextBgOpacity] = useState<number>(0.2);
  const [textSize, setTextSize] = useState<number>(24);
  const [textPosition, setTextPosition] = useState<ImageState>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        `${BASE_URL}/image-modifier/remove-bg/`,
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

  const handleDrag: DraggableEventHandler = (e, data: DraggableData) => {
    setTextPosition({ x: data.x, y: data.y });
  };

  const downloadWithGradientAndText = () => {
    if (!processedImage || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    const container = containerRef.current;
    const imgElement = container.querySelector("img");

    img.onload = () => {
      if (!ctx || !imgElement) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Add multiline text
      if (customText) {
        ctx.font = `${textSize * 2}px Arial`; // Scaling font size for canvas
        ctx.textAlign = "center";
        const lines = customText.split("\n");
        const lineHeight = textSize * 2; // Adjusted line height for consistency
        let maxWidth = 0;

        // Calculate max width for background
        lines.forEach((line) => {
          const metrics = ctx.measureText(line);
          maxWidth = Math.max(maxWidth, metrics.width);
        });

        // Calculate scaling factor
        const scaleX = img.width / imgElement.offsetWidth;
        const scaleY = img.height / imgElement.offsetHeight;

        // Adjust text position
        const textX = (container.offsetWidth / 2 + textPosition.x) * scaleX;
        const totalHeight = lines.length * lineHeight;
        const textYBase = (container.offsetHeight / 2 + textPosition.y) * scaleY + lineHeight / 2;

        // Draw text background, centered vertically
        const bgPadding = 10; // Consistent padding around text
        ctx.fillStyle = `${textBgColor}${Math.round(textBgOpacity * 255).toString(16).padStart(2, "0")}`;
        ctx.fillRect(
          textX - maxWidth / 2 - bgPadding,
          textYBase - lineHeight - totalHeight / 2 - bgPadding,
          maxWidth + bgPadding * 2,
          totalHeight + bgPadding * 2
        );

        // Draw text
        ctx.fillStyle = textColor;
        lines.forEach((line, index) => {
          const textY = textYBase + (index - (lines.length - 1) / 2) * lineHeight;
          ctx.fillText(line, textX, textY);
        });
      }

      const link = document.createElement("a");
      link.download = "custom_image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = processedImage;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Advanced Image Background Removal and Gradient Color Customization Tool
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

            {/* Processed Image with Gradient and Text */}
            {processedImage && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Edited Image</h3>
                <div
                  ref={containerRef}
                  className="w-full rounded-md max-h-[400px] flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom right, ${gradientStart}, ${gradientEnd})`,
                  }}
                >
                  <img
                    src={processedImage}
                    alt="With Gradient"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  {customText && (
                    <Draggable
                      nodeRef={draggableRef}
                      bounds="parent"
                      onDrag={handleDrag}
                      position={textPosition}
                    >
                      <div
                        ref={draggableRef}
                        style={{
                          color: textColor,
                          fontSize: `${textSize}px`,
                          position: "absolute",
                          cursor: "move",
                          userSelect: "none",
                          backgroundColor: `${textBgColor}${Math.round(textBgOpacity * 255).toString(16).padStart(2, "0")}`,
                          padding: "2px 5px",
                          borderRadius: "4px",
                          whiteSpace: "pre-wrap",
                          textAlign: "center",
                        }}
                      >
                        {customText}
                      </div>
                    </Draggable>
                  )}
                </div>

                <div className="space-y-4 mt-4">
                  {/* Gradient Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Color
                      </label>
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Color
                      </label>
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Controls */}
                  <div className="space-y-2">
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Enter custom text (use Enter for new lines)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Size
                        </label>
                        <input
                          type="number"
                          value={textSize}
                          onChange={(e) => setTextSize(Math.max(10, e.target.value))}
                          min="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Bg Color
                        </label>
                        <input
                          type="color"
                          value={textBgColor}
                          onChange={(e) => setTextBgColor(e.target.value)}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bg Opacity (0-1)
                        </label>
                        <input
                          type="number"
                          value={textBgOpacity}
                          onChange={(e) => setTextBgOpacity(Math.max(0, Math.min(1, e.target.value)))}
                          min="0"
                          max="1"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={downloadWithGradientAndText}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition duration-200"
                  >
                    Download Custom Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default GradientBackground;
