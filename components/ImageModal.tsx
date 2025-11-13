import React, { useState } from 'react';
import { Icon } from './Icon';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  isEditing: boolean;
  onClose: () => void;
  onEdit: (prompt: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, isEditing, onClose, onEdit }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen || !imageUrl) return null;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onEdit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full relative">
        <button onClick={onClose} className="absolute -top-3 -right-3 bg-red-600 rounded-full p-1.5 text-white hover:bg-red-700 transition-transform duration-200 hover:scale-110 z-10">
          <Icon name="X" size={20} />
        </button>
        <div className="p-4">
          <div className="relative aspect-video bg-gray-900 rounded-md overflow-hidden mb-4">
            <img src={imageUrl} alt="Generated Rendering" className="w-full h-full object-contain" />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <Icon name="Loader" size={48} className="animate-spin text-blue-400" />
                <p className="ml-4 text-lg">Applying edits...</p>
              </div>
            )}
          </div>
          <form onSubmit={handleEditSubmit} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Add a retro filter" or "Make it look like a blueprint"'
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEditing}
            />
            <button
              type="submit"
              disabled={isEditing || !prompt.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="Wand2" size={18} />
              <span>Edit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
