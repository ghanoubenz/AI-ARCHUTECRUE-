import React, { useState, useEffect } from 'react';
import { useSceneStore } from './store/useSceneStore';
import TwoDView from './components/TwoDView';
import ThreeDView from './components/ThreeDView';
import ControlBar from './components/ControlBar';
import LoadingModal from './components/LoadingModal';
import ImageModal from './components/ImageModal';
import VideoPlayer from './components/VideoPlayer';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import { updateSceneFromPrompt, generateImageRendering, editImageWithPrompt, generateVideoFlythrough } from './services/geminiService';
// FIX: Import the Icon component to be used in the error toast.
import { Icon } from './components/Icon';

// FIX: Removed global declaration. It was moved to types.ts to fix declaration errors.

type LoadingState = 'idle' | 'processing' | 'rendering' | 'editing' | 'generating_video';
const VIDEO_LOADING_MESSAGES = [
    "Contacting architectural consultant AI...",
    "Generating cinematic camera paths...",
    "Rendering frames in the cloud...",
    "Applying post-processing effects...",
    "This can take a few minutes, thanks for your patience!",
];


const App: React.FC = () => {
    const { scene, setScene } = useSceneStore();
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [isApiKeySelectedForVideo, setIsApiKeySelectedForVideo] = useState(false);
    
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio?.hasSelectedApiKey) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsApiKeySelectedForVideo(hasKey);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectVideoApiKey = async () => {
        try {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions, UI will reflect this optimism.
            setIsApiKeySelectedForVideo(true);
            setToastMessage("API key selected. You can now generate videos.");
        } catch (e) {
            console.error("Error opening API key selection:", e);
            setError("Could not open the API key selection dialog.");
        }
    };

    const displayToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handlePromptSubmit = async (prompt: string, isQuestion: boolean) => {
        setLoadingState('processing');
        setError(null);
        try {
            if (isQuestion) {
                // This feature is not in the new spec, but the control bar implies it.
                // We'll just show a toast for now. A real implementation would call a different Gemini endpoint.
                displayToast("Answering questions is not yet implemented.");
            } else {
                const previousLockState = scene.structureLock;
                const newScene = await updateSceneFromPrompt(prompt, scene);
                setScene(newScene);
                if (previousLockState && !newScene.structureLock) {
                    displayToast("Structure Lock was automatically disabled to move an element.");
                }
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An error occurred while processing the prompt.");
        } finally {
            setLoadingState('idle');
        }
    };
    
    const handleGenerateImage = async () => {
        setLoadingState('rendering');
        setError(null);
        try {
            const imageUrl = await generateImageRendering(scene);
            setGeneratedImageUrl(imageUrl);
        } catch (e: any) {
            setError(e.message || "Failed to generate image.");
        } finally {
            setLoadingState('idle');
        }
    };

    const handleEditImage = async (prompt: string) => {
        if (!generatedImageUrl) return;
        setLoadingState('editing');
        setError(null);
        try {
            const newImageUrl = await editImageWithPrompt(generatedImageUrl, prompt);
            setGeneratedImageUrl(newImageUrl);
        } catch (e: any) {
            setError(e.message || "Failed to edit image.");
        } finally {
            setLoadingState('idle');
        }
    };

    const handleGenerateVideo = async (aspectRatio: '16:9' | '9:16') => {
        setLoadingState('generating_video');
        setError(null);
        try {
            const videoUrl = await generateVideoFlythrough(scene, aspectRatio);
            setGeneratedVideoUrl(videoUrl);
        } catch (e: any) {
            console.error(e);
             if (e.message?.includes("Requested entity was not found")) {
                setError("API Key not found. Please re-select your API key.");
                setIsApiKeySelectedForVideo(false);
            } else {
                setError(e.message || "Failed to generate video.");
            }
        } finally {
            setLoadingState('idle');
        }
    };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white font-sans">
      <main className="flex-grow flex flex-col p-4 gap-4">
        <div className="flex-grow flex gap-4 relative">
            <Toolbar />
            <PropertiesPanel />
            <div className="w-1/2 h-full">
                <TwoDView sceneData={scene} />
            </div>
            <div className="w-1/2 h-full">
                <ThreeDView sceneData={scene} />
            </div>
        </div>
        <ControlBar
            onPromptSubmit={handlePromptSubmit}
            onGenerateImage={handleGenerateImage}
            onGenerateVideo={handleGenerateVideo}
            isProcessing={loadingState !== 'idle'}
            isApiKeySelectedForVideo={isApiKeySelectedForVideo}
            onSelectVideoApiKey={handleSelectVideoApiKey}
        />
      </main>
      
      <LoadingModal 
        isOpen={loadingState === 'generating_video'}
        title="Generating Video Fly-through"
        messages={VIDEO_LOADING_MESSAGES}
      />
      <ImageModal
        isOpen={!!generatedImageUrl}
        imageUrl={generatedImageUrl}
        isEditing={loadingState === 'editing'}
        onClose={() => setGeneratedImageUrl(null)}
        onEdit={handleEditImage}
      />
       <VideoPlayer 
        videoUrl={generatedVideoUrl}
        onClose={() => setGeneratedVideoUrl(null)}
      />

      {error && (
         <div className="absolute bottom-24 right-4 bg-red-800 text-white p-3 rounded-lg shadow-lg text-sm max-w-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <p><span className="font-bold">Error:</span> {error}</p>
                <button onClick={() => setError(null)} className="ml-4 text-red-200 hover:text-white">
                    <Icon name="X" size={18} />
                </button>
            </div>
        </div>
      )}
       {toastMessage && (
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-blue-800 text-white p-3 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-bottom-4">
            <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;