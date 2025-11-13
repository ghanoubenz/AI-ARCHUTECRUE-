import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import type { Shape } from '../types';
import { useTextures } from '../hooks/useTextures';

const SCALE = 20; // 20 pixels in 2D = 1 meter in 3D
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 100;

const Building: React.FC<{ shape: Shape }> = ({ shape }) => {
  const textures = useTextures();
  const selectedTexture = textures[shape.structureType];
  
  // Adjust texture repeat based on dimensions
  const texture = selectedTexture.clone();
  texture.repeat.set(shape.width / 50, shape.extrusionHeight / 3);
  texture.needsUpdate = true;

  const position: [number, number, number] = [
    (shape.x + shape.width / 2) / SCALE - (WORLD_WIDTH / 2),
    shape.extrusionHeight / 2,
    (shape.y + shape.height / 2) / SCALE - (WORLD_HEIGHT / 2)
  ];
  
  const rotationY = THREE.MathUtils.degToRad(-shape.rotation);

  return (
    <Box
      args={[shape.width / SCALE, shape.extrusionHeight, shape.height / SCALE]}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      <meshStandardMaterial map={texture} color={shape.color} />
    </Box>
  );
};

const Scene: React.FC = () => {
  const shapes = useStore((state) => state.shapes);
  return (
    <>
      {shapes.map((shape) => <Building key={shape.id} shape={shape} />)}
    </>
  );
};

const ThreeDCanvas: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-800">
      <Canvas camera={{ position: [0, 50, 60], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 5]} intensity={1.5} />
        <Grid
          position={[0, 0, 0]}
          args={[WORLD_WIDTH, WORLD_HEIGHT]}
          sectionColor={'#6366f1'}
          cellColor={'#4f46e5'}
          sectionThickness={1}
          cellThickness={0.5}
          fadeDistance={150}
          infiniteGrid
        />
        <Suspense fallback={<Html center><span className="text-white">Loading...</span></Html>}>
          <Scene />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
