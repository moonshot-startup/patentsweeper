import { useState } from "react";
import "./fileUploader.css";
import { IoMdCloudUpload } from "react-icons/io";

export const FileUploader: React.FC = (props: {onFileUpload: (file: any) => void}) => {
    const [file, setFile] = useState(null);
    
    const clickInput = () => {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    }
    const handleFileChange = (event: any) => {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      props.onFileUpload(uploadedFile); // Send the file to the parent component
    };

    return (
        <div className="file-uploader">
            <IoMdCloudUpload className="cloud-icon"/>
            <input type="file" id="file-input" className="input-file" onChange={handleFileChange} />
            <button className="upload-btn" onClick={clickInput}>Upload</button>
        </div>
    );
}