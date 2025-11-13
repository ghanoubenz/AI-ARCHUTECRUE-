import React, { useState } from 'react';
import { Icon } from './Icon';

interface ControlBarProps {
  onPromptSubmit: (prompt: string, isQuestion: boolean) => void;
  onGenerateImage: () => void;
  onGenerateVideo: (aspectRatio: '16:9' | '9:16') => void;
  isProcessing: boolean;
  isApiKeySelectedForVideo: boolean;
  onSelectVideoApiKey: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ 
    onPromptSubmit, 
    onGenerateImage,
    onGenerateVideo,
    isProcessing,
    isApiKeySelectedForVideo,
    onSelectVideoApiKey
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const isQuestion = prompt.trim().endsWith('?');
      onPromptSubmit(prompt, isQuestion);
      setPrompt('');
    }
  };

  return (
    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-lg">
        {!isApiKeySelectedForVideo && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-md mb-3 text-sm flex items-center justify-between">
                <div>
                    <p>
                        Video generation requires an API key and may incur costs. 
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white ml-1">Learn more about billing.</a>
                    </p>
                </div>
                <button onClick={onSelectVideoApiKey} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md transition-colors whitespace-nowrap">
                    Select API Key
                </button>
            </div>
        )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="relative flex-grow">
          <Icon name="Bot" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Change the warehouse roof to blue' or 'How many parking slots are there?'"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isProcessing}
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing || !prompt.trim()}
          className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? <Icon name="Loader" className="animate-spin" /> : <Icon name="Send" />}
        </button>
      </form>
      <div className="flex items-center justify-center gap-4 mt-3">
        <button onClick={onGenerateImage} disabled={isProcessing} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
            <Icon name="Image" size={16} />
            <span>Generate Rendering</span>
        </button>
        <div className="border-l border-gray-600 h-5"></div>
        <button onClick={() => onGenerateVideo('16:9')} disabled={isProcessing || !isApiKeySelectedForVideo} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
            <Icon name="Video" size={16} />
            <span>Fly-through (16:9)</span>
        </button>
         <button onClick={() => onGenerateVideo('9:16')} disabled={isProcessing || !isApiKeySelectedForVideo} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
            <Icon name="Film" size={16} />
            <span>(9:16)</span>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
