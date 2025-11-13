import React from 'react';
import { useSceneStore } from '../store/useSceneStore';
import { Icon } from './Icon';

const Toolbar: React.FC = () => {
  const { scene, toggleStructureLock } = useSceneStore();

  const handleExport = () => {
    const jsonString = JSON.stringify(scene, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene-layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg border border-gray-700 flex flex-col items-center gap-3 shadow-lg">
      <button
        onClick={() => alert('Import not implemented.')}
        className="flex flex-col items-center gap-1 text-xs w-full px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        title="Import JSON"
      >
        <Icon name="FileUp" size={20} />
        <span>Import</span>
      </button>
      <button
        onClick={handleExport}
        className="flex flex-col items-center gap-1 text-xs w-full px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        title="Export JSON"
      >
        <Icon name="FileDown" size={20} />
        <span>Export</span>
      </button>
      <div className="w-full h-[1px] bg-gray-700 my-1"></div>
      <button
        onClick={toggleStructureLock}
        className={`flex flex-col items-center gap-1 text-xs w-full px-2 py-1 rounded-md transition-colors ${
          scene.structureLock ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title="Toggle Structure Lock"
      >
        {scene.structureLock ? <Icon name="Lock" size={20} /> : <Icon name="Unlock" size={20} />}
        <span>{scene.structureLock ? 'Locked' : 'Unlocked'}</span>
      </button>
    </div>
  );
};

export default Toolbar;
