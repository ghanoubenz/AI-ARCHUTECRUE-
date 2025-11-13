import React from 'react';
import { useSceneStore } from '../store/useSceneStore';
import { Icon } from './Icon';

const PropertiesPanel: React.FC = () => {
  const { selectedObject, setSelectedObject } = useSceneStore();

  return (
    <div className="absolute top-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700 w-64 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Properties</h3>
        {selectedObject && (
            <button onClick={() => setSelectedObject(null)} className="text-gray-400 hover:text-white">
                <Icon name="X" size={16} />
            </button>
        )}
      </div>
       {selectedObject ? (
         <div className="text-xs text-gray-300 space-y-1">
            <p><span className="font-semibold text-gray-100">ID:</span> {selectedObject.data.id}</p>
            <p><span className="font-semibold text-gray-100">Type:</span> {selectedObject.type}</p>
            <p><span className="font-semibold text-gray-100">Position:</span> x: {selectedObject.data.x}, y: {selectedObject.data.y}</p>
            <p><span className="font-semibold text-gray-100">Size:</span> w: {selectedObject.data.w}, h: {selectedObject.data.h}</p>
         </div>
       ) : (
        <p className="text-xs text-gray-400">Select an object in the 2D view to see its properties.</p>
       )}
    </div>
  );
};

export default PropertiesPanel;
