"use client"; // This is a client component 👈🏽
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Send } from "lucide-react";
import { useDispatch } from "react-redux";
import { update as keywordUpdate } from "../../store/keywordsSlice";
import { update as pdfDateSlice } from "../../store/pdfDataSlice";
import PdfPreview from '../../componenets/PdfPreview';

export default function UploadComponent(this: any, props) {
  // local state
  const [file, setFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // global state
  const dispatch = useDispatch();
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
    setUploadStatus("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/pdf/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setUploadStatus("Upload failed. Please try again.");
        return;
      }
      setUploadStatus("File uploaded successfully!");
      const data = await response.json();

      dispatch(keywordUpdate(data.keyword));
      dispatch(pdfDateSlice(formData));

      setIsUploading(false);
      router.push("/dashboard/loading");
    } catch (error) {
      setUploadStatus("An error occurred. Please try again.");
      setIsUploading(false);
      console.error("Upload error:", error);
    }

    setIsUploading(false);
  };

  return (
    <div className="flex justify-between items-start w-full">
    <div className="flex-1 p-4 bg-gradient-to-br from-white to-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center text-gray-800">
        File Uploader
      </h2>
      <div className="flex items-center space-x-2">
        <div className="relative group flex-grow">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className={`flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-md cursor-pointer group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 ${
              isHovered ? "shadow-md" : ""
            }`}
          >
            <Upload className="mr-1" size={16} />
            <span className="font-medium">Choose File</span>
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`px-3 py-2 text-white text-sm font-medium rounded-md transition-colors duration-300 flex items-center ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <Send size={16} className="mr-1" />
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </div>
      <div className="mt-2 text-center">
        {file ? (
          <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm inline-block transition-all duration-300 animate-fade-in-up">
            Selected: <span className="font-semibold">{file.name}</span>
          </p>
        ) : (
          <p className="text-xs text-gray-500 italic">No file chosen</p>
        )}
      </div>
      {uploadStatus && (
        <p
          className={`mt-2 text-xs text-center ${
            uploadStatus.includes("success")
              ? "text-green-600"
              : uploadStatus.includes("failed") ||
                uploadStatus.includes("error")
              ? "text-red-600"
              : "text-blue-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}
      <PdfPreview file={file} />
    </div>
    </div>
  );
}
