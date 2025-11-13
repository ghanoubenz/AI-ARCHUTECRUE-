import React from 'react';
import { Icon } from './Icon';

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  messages: string[];
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, title, messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, messages.length]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="animate-spin text-blue-400 mx-auto mb-4">
            <Icon name="Loader" size={48} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-300 transition-opacity duration-500">
          {messages[currentMessageIndex]}
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
