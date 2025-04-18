import { useState, useRef, FormEvent } from "react";

const CardImage = () => {
  const [name, setName] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [testimonial, setTestimonial] = useState<string>("");
  const [gradientStart, setGradientStart] = useState<string>("#4f46e5");
  const [gradientEnd, setGradientEnd] = useState<string>("#9333ea");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const downloadCardAsImage = () => {
    if (!cardRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const card = cardRef.current;

    if (!ctx) return;

    // Set canvas size to match the card
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;

    // Apply gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling
    ctx.fillStyle = "#ffffff"; // White text
    ctx.textAlign = "left";

    // Name
    ctx.font = "bold 24px Arial"; // Matches text-xl font-semibold
    ctx.fillText(name || "Your Name", 24, 40);

    // To
    ctx.font = "italic 14px Arial"; // Matches text-sm italic
    ctx.fillText(`To: ${to || "Recipient"}`, 24, 70);

    // Testimonial
    ctx.font = "16px Arial"; // Matches text-base
    const lines = (testimonial || "Your testimonial or objective goes here...").split("\n");
    const lineHeight = 24; // Matches leading-relaxed roughly
    let y = 100;
    lines.forEach((line) => {
      const wrappedLines = wrapText(ctx, line, canvas.width - 48, 16); // 48px for padding
      wrappedLines.forEach((wrappedLine) => {
        ctx.fillText(wrappedLine, 24, y);
        y += lineHeight;
      });
    });

    // Download the image
    const link = document.createElement("a");
    link.download = "testimonial_card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    ctx.font = `${fontSize}px Arial`;
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(`${currentLine} ${word}`).width;
      if (width < maxWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create a Testimonial Card
      </h2>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter recipient"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimonial/Objective
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Enter testimonial or objective"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gradient Start Color
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
                Gradient End Color
              </label>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
          >
            Update Card
          </button>
        </form>
      </div>

      {/* Card Display */}
      {(name || to || testimonial) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div
            ref={cardRef}
            className="p-6 rounded-md text-white"
            style={{
              background: `linear-gradient(to bottom right, ${gradientStart}, ${gradientEnd})`,
            }}
          >
            <h3 className="text-xl font-semibold mb-2">
              {name || "Your Name"}
            </h3>
            <p className="text-sm italic mb-2">To: {to || "Recipient"}</p>
            <p className="text-base leading-relaxed">
              {testimonial || "Your testimonial or objective goes here..."}
            </p>
          </div>
          <button
            onClick={downloadCardAsImage}
            className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-200"
          >
            Download as Image
          </button>
        </div>
      )}

      {/* Hidden canvas for image conversion */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CardImage;
