import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = () => {
    if (file) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-husky-purple flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-kavoon text-white text-center mb-8 md:mb-16">
        Upload your Resume
      </h1>
      
      <div
        className={`relative w-full max-w-md md:max-w-lg transition-all ${
          isDragging ? "scale-105" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="resume-upload"
          className={`flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer rounded-2xl border-4 border-dashed transition-all ${
            isDragging
              ? "border-husky-gold bg-white/10"
              : "border-white/30 hover:border-white/50 hover:bg-white/5"
          }`}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/08b4a4e8a0d459476565276467290aaddae15456?width=974"
            alt="Upload folder"
            className="w-48 h-48 md:w-80 md:h-80 object-contain mb-6"
          />
          {file ? (
            <div className="text-center">
              <p className="text-white text-xl md:text-2xl font-kavoon mb-2">
                {file.name}
              </p>
              <p className="text-white/70 text-sm md:text-base">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <p className="text-white/70 text-lg md:text-xl text-center">
              Click to browse or drag and drop your resume
            </p>
          )}
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          className="mt-8 px-8 py-4 bg-husky-gold text-white text-xl md:text-2xl font-kavoon rounded-lg hover:bg-opacity-90 transition-all"
        >
          Continue to Dashboard
        </button>
      )}
    </div>
  );
}
