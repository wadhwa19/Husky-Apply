import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serverResponse, setServerResponse] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      // auto-upload
      void tryClientExtractThenUpload(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      void tryClientExtractThenUpload(f);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    await uploadFile(file);
  };

  async function uploadFile(fileToUpload: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      const resp = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const body = await resp.json();
      if (!resp.ok) {
        // show server message if available
        const msg = body && (body.message || body.error) ? (body.message || body.error) : 'Failed to parse resume';
        alert(msg);
        return;
      }
      // Instead of navigating immediately, keep the server response and show a preview modal
      setServerResponse(body);
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume");
    } finally {
      setUploading(false);
    }
  }

  // Attempt to extract text client-side for PDFs using pdf.js, then POST text to /api/parse-text.
  // If extraction fails or the file is not a PDF, fallback to uploadFile().
  async function tryClientExtractThenUpload(fileToUpload: File) {
    if (!fileToUpload) return;
    setUploading(true);
    const isPdf = fileToUpload.type === 'application/pdf' || fileToUpload.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setUploading(false);
      return uploadFile(fileToUpload);
    }

    try {
      const arrayBuffer = await fileToUpload.arrayBuffer();
      // dynamic import to avoid bundling issues
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // set worker src to the package worker entry (Vite serves node_modules in dev)
      try { (pdfjs as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'; } catch { }

      const pdf = await (pdfjs as any).getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strs = content.items.map((it: any) => it.str || '').join(' ');
        fullText += '\n' + strs;
      }

      // If extracted text is short, fallback to server-side file upload
      if (!fullText || fullText.trim().length < 50) {
        return uploadFile(fileToUpload);
      }

      // post extracted text to server heuristics endpoint
      const resp = await fetch('/api/parse-text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: fullText }) });
      const body = await resp.json();
      if (!resp.ok) {
        // fallback to binary upload
        return uploadFile(fileToUpload);
      }
      setServerResponse(body);
    } catch (err) {
      console.error('client pdf extraction failed', err);
      // fallback to upload
      await uploadFile(fileToUpload);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-husky-purple flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-kavoon text-white text-center mb-8 md:mb-16">
        Upload your Resume
      </h1>

      <div
        className={`relative w-full max-w-md md:max-w-lg transition-all ${isDragging ? "scale-105" : ""
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
          className={`flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer rounded-2xl border-4 border-dashed transition-all ${isDragging
              ? "border-husky-gold bg-white/10"
              : "border-white/30 hover:border-white/50 hover:bg-white/5"
            }`}
          aria-disabled={uploading}
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

      {uploading ? (
        <div className="mt-8 px-8 py-4 bg-white/10 text-white text-xl md:text-2xl font-kavoon rounded-lg">
          Uploading...
        </div>
      ) : null}

      {/* Server response preview modal */}
      {serverResponse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="w-full max-w-2xl bg-[rgba(31,27,27,0.95)] rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Parsed response preview</h2>
            <p className="text-sm text-gray-300 mb-4">Inspect the JSON returned by the server. If it looks like binary PDF content (starts with "%PDF" or contains "obj"), the server couldn't extract text.</p>
            <pre className="max-h-64 overflow-auto text-xs bg-black/30 p-3 rounded mb-4 whitespace-pre-wrap">
              {JSON.stringify(serverResponse, null, 2)}
            </pre>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setServerResponse(null)}
                className="px-4 py-2 rounded bg-white/10"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  // navigate to scholarship with parsed data
                  navigate('/scholarship', { state: { parsed: serverResponse } });
                  setServerResponse(null);
                }}
                className="px-6 py-2 rounded bg-husky-green text-black font-bold"
              >
                Continue to Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
