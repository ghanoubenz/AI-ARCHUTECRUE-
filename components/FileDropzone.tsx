import React, { useCallback } from 'react';
import { useStore } from '../store';
import { ImageUp } from 'lucide-react';

interface FileDropzoneProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ inputRef }) => {
  const setBackgroundImage = useStore((state) => state.setBackgroundImage);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setBackgroundImage({ src, width: img.width, height: img.height });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  }, [setBackgroundImage]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center text-gray-500">
        <ImageUp size={48} className="mx-auto" />
        <p className="mt-2 font-semibold">Drop image here or click "Upload Plan"</p>
        <p className="text-sm">Trace over your floor plan to create a 3D model</p>
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
    </div>
  );
};

export default FileDropzone;
