import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Box } from '@react-three/drei';
import * as THREE from 'three';
import type { Scene, Office, Warehouse } from '../types';

const Z_OFFSET = -50;
const X_OFFSET = -80;
const HEIGHT_SCALE = 1.5;

const Ground: React.FC<{ plot: Scene['plot'] }> = ({ plot }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[plot.bounds.w, plot.bounds.h]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
);

const OfficeBuilding: React.FC<{ office: Office }> = ({ office }) => (
    <Box position={[office.x + office.w/2 + X_OFFSET, 5 * HEIGHT_SCALE / 2, office.y + office.h/2 + Z_OFFSET]} args={[office.w, 5 * HEIGHT_SCALE, office.h]} castShadow>
        <meshStandardMaterial color={office.color} />
    </Box>
);

const WarehouseBuilding: React.FC<{ warehouse: Warehouse }> = ({ warehouse }) => {
    const { w, h, roof } = warehouse;
    const wallHeight = 8 * HEIGHT_SCALE;
    const roofHeight = 4 * HEIGHT_SCALE;

    const roofShape = new THREE.Shape();
    roofShape.moveTo(0, wallHeight);
    roofShape.lineTo(w / 2, wallHeight + roofHeight);
    roofShape.lineTo(w, wallHeight);
    roofShape.lineTo(0, wallHeight);

    return (
        <group position={[warehouse.x + X_OFFSET, 0, warehouse.y + Z_OFFSET]}>
            {/* Main Box */}
            <Box args={[w, wallHeight, h]} position={[w/2, wallHeight/2, h/2]} castShadow>
                <meshStandardMaterial color={warehouse.wallColor} />
            </Box>
            {/* Pitched Roof */}
            {roof.type === 'pitched' && (
                <mesh position={[0, 0, h]} rotation={[0, Math.PI/2, 0]} castShadow>
                    <extrudeGeometry args={[roofShape, { depth: h, bevelEnabled: false }]} />
                    <meshStandardMaterial color={warehouse.roofColor} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
};

interface ThreeDViewProps {
  sceneData: Scene;
}

const ThreeDView: React.FC<ThreeDViewProps> = ({ sceneData }) => {
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 shadow-inner relative">
       <div className="absolute top-2 left-3 bg-black/50 px-2 py-1 rounded-md text-xs z-10">3D View</div>
      <Canvas shadows camera={{ position: [0, 80, 100], fov: 50 }}>
        <Suspense fallback={<Html center><span className="text-white">Loading 3D View...</span></Html>}>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[100, 100, 50]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment preset="city" />
          <Ground plot={sceneData.plot} />
          
          {sceneData.offices.map(o => <OfficeBuilding key={o.id} office={o} />)}
          <WarehouseBuilding warehouse={sceneData.warehouse} />
          
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeDView;
