import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { useStore } from '../store';
import type { Shape } from '../types';
import useImage from '../hooks/useImage'; // A simple hook to load images for Konva

// A simple hook to load images for Konva
const useKonvaImage = (src: string | undefined) => {
    const [image] = useImage(src || '');
    return image;
};

interface ShapeRectProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
}

const ShapeRect: React.FC<ShapeRectProps> = ({ shape, isSelected, onSelect }) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const updateShape = useStore((state) => state.updateShape);

  useEffect(() => {
    if (isSelected && shapeRef.current && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    updateShape(shape.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shape}
        draggable
        onDragEnd={(e) => {
          updateShape(shape.id, { x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={handleTransformEnd}
        stroke="#007bff"
        strokeWidth={isSelected ? 2 : 0}
        fill={shape.color + 'A0'} // Add some transparency
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface TwoDCanvasProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const TwoDCanvas: React.FC<TwoDCanvasProps> = ({ fileInputRef }) => {
  const { shapes, selectedShapeId, setSelectedShapeId, backgroundImage } = useStore();
  const konvaImage = useKonvaImage(backgroundImage?.src);
  const stageRef = useRef<Konva.Stage>(null);

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedShapeId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    stage.setPointersPositions(e);
    // You could also handle file drops here if you wanted
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();


  return (
    <div className="w-full h-full bg-gray-700 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px] relative"
     onDrop={handleDrop} onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={window.innerWidth / 2}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        className="cursor-crosshair"
      >
        <Layer>
            {konvaImage && <KonvaImage image={konvaImage} width={backgroundImage?.width} height={backgroundImage?.height} opacity={0.7} />}
        </Layer>
        <Layer>
          {shapes.map((shape) => (
            <ShapeRect
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedShapeId}
              onSelect={() => setSelectedShapeId(shape.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default TwoDCanvas;
