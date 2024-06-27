import { useEffect, useState } from 'react';

interface PdfPreviewProps {
  file: File | null;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ file }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file) {
    return null;
  }

  return (
    <div className="pdf-preview">
      <iframe src={pdfUrl || undefined} width="100%" height="500px" />
    </div>
  );
};

export default PdfPreview;