import React from 'react';
import { Icon } from './Icon';

interface VideoPlayerProps {
  videoUrl: string | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute -top-3 -right-3 bg-red-600 rounded-full p-1.5 text-white hover:bg-red-700 transition-transform duration-200 hover:scale-110 z-10">
          <Icon name="X" size={20} />
        </button>
        <div className="p-4">
          <video src={videoUrl} controls autoPlay className="w-full rounded-md aspect-video bg-black" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
