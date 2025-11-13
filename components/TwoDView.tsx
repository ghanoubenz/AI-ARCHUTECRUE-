import React, { useState, useRef, MouseEvent } from 'react';
import type { Scene } from '../types';

interface TwoDViewProps {
  sceneData: Scene;
}

const TwoDView: React.FC<TwoDViewProps> = ({ sceneData }) => {
  const [isPanning, setIsPanning] = useState(false);
  const [viewBox, setViewBox] = useState({ x: -10, y: -10, width: 180, height: 140 });
  const startPoint = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    const scale = viewBox.width / e.currentTarget.getBoundingClientRect().width;
    const dx = (e.clientX - startPoint.current.x) * scale;
    const dy = (e.clientY - startPoint.current.y) * scale;
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mousePoint = { x: e.clientX - svgRect.left, y: e.clientY - svgRect.top };
    
    const newWidth = e.deltaY < 0 ? viewBox.width / scaleFactor : viewBox.width * scaleFactor;
    const newHeight = e.deltaY < 0 ? viewBox.height / scaleFactor : viewBox.height * scaleFactor;

    const dx = (mousePoint.x / svgRect.width) * (viewBox.width - newWidth);
    const dy = (mousePoint.y / svgRect.height) * (viewBox.height - newHeight);

    setViewBox({ x: viewBox.x + dx, y: viewBox.y + dy, width: newWidth, height: newHeight });
  };

  // Generate tree positions based on landscape settings
  const trees = [];
  const { plot, landscape } = sceneData;
  if (landscape.perimeter.includes('N')) {
    for (let x = 0; x < plot.bounds.w; x += landscape.treeSpacing) trees.push({ id: `t-n-${x}`, x, y: 2 });
  }
  if (landscape.perimeter.includes('W')) {
     for (let y = 0; y < plot.bounds.h; y += landscape.treeSpacing) trees.push({ id: `t-w-${y}`, x: 2, y });
  }
  if (landscape.perimeter.includes('S')) {
     for (let x = 0; x < plot.bounds.w; x += landscape.treeSpacing) trees.push({ id: `t-s-${x}`, x, y: plot.bounds.h - 2 });
  }


  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-inner relative">
      <div className="absolute top-2 left-3 bg-black/50 px-2 py-1 rounded-md text-xs">2D Schematic</div>
      <svg
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Plot background */}
        <defs>
            <mask id="plotMask">
                <rect x="0" y="0" width={plot.bounds.w} height={plot.bounds.h} fill="white"/>
                {plot.mask?.map((m, i) => <rect key={i} x={m.x} y={m.y} width={m.w} height={m.h} fill="black"/>)}
            </mask>
        </defs>
        <rect x="0" y="0" width={plot.bounds.w} height={plot.bounds.h} fill="#2D3748" mask="url(#plotMask)"/>

        {/* Roads */}
        <path d={`M ${sceneData.roads.east.map(p => `${p.x} ${p.y}`).join(' L ')}`} stroke="#4A5568" strokeWidth={sceneData.roads.width} fill="none" />
        <path d={`M ${sceneData.roads.west_turnaround_path.map(p => `${p.x} ${p.y}`).join(' L ')}`} stroke="#4A5568" strokeWidth={sceneData.roads.width} fill="none" strokeLinejoin='round' strokeLinecap='round'/>
        <line x1={sceneData.roads.northEntrance.x} y1="0" x2={sceneData.roads.northEntrance.x} y2={sceneData.roads.northEntrance.y} stroke="#4A5568" strokeWidth={sceneData.roads.width} />

        {/* Parking Lot */}
        <rect x={sceneData.roads.northEntrance.x - 20} y={sceneData.roads.northEntrance.y} width={40} height={10} fill="#4A5568" />

        {/* Buildings */}
        {sceneData.offices.map(office => (
          <rect key={office.id} x={office.x} y={office.y} width={office.w} height={office.h} fill={office.color} stroke="#1A202C" strokeWidth="0.5" />
        ))}
        <rect x={sceneData.warehouse.x} y={sceneData.warehouse.y} width={sceneData.warehouse.w} height={sceneData.warehouse.h} fill={sceneData.warehouse.wallColor} stroke="#1A202C" strokeWidth="0.5" />

        {/* Courtyard & Fountain */}
        {sceneData.courtyard.fountain && <circle cx={sceneData.courtyard.x + sceneData.courtyard.w / 2} cy={sceneData.courtyard.y + sceneData.courtyard.h / 2} r={3} fill="#63B3ED" />}
        
        {/* Trees */}
        {trees.map(tree => <circle key={tree.id} cx={tree.x} cy={tree.y} r={1.5} fill="#2F855A" /> )}
      </svg>
    </div>
  );
};

export default TwoDView;
