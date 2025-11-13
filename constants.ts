import type { Scene } from './types';

// This initial state has been updated to reflect the layout and dimensions
// from the provided architectural plan image, while fitting within the original L-shaped plot.
export const INITIAL_SCENE: Scene = {
  units: 'm',
  // The plot shape is the original L-shape.
  plot: { shape: 'L', bounds: { w: 160, h: 120 }, mask: [{ x: 120, y: 0, w: 40, h: 40 }] },
  
  // Dimensions are derived from image analysis (Offices ~30x32, Production ~70x35)
  // and placed within the L-shaped plot.
  offices: [
    { id: 'officeA', x: 42.5, y: 25, w: 30, h: 32, material: 'concrete', color: '#E2E8F0' },
    { id: 'officeB', x: 87.5, y: 25, w: 30, h: 32, material: 'concrete', color: '#E2E8F0' }
  ],
  courtyard: { x: 72.5, y: 25, w: 15, h: 32, fountain: true },
  warehouse: {
    id: 'wh1', x: 45, y: 75, w: 70, h: 35,
    material: 'steel', wallColor: '#CBD5E0', roofColor: '#A0AEC0',
    roof: { type: 'pitched', skylights: 16 } // Increased skylights to better match image
  },
  
  // Roads are adjusted to match the paths shown in the image.
  roads: {
    northEntrance: { x: 80, y: 10, parking: { slots: 4 } },
    // The main road along the east and south perimeter.
    east: [
        { x: 150, y: 45 }, // Start below the masked area
        { x: 150, y: 110 }, 
        { x: 20, y: 110 }
    ],
    // A simple U-turn loop on the west side.
    west_turnaround_path: [
        { x: 20, y: 90 },
        { x: 10, y: 90 },
        { x: 10, y: 70 },
        { x: 20, y: 70 },
    ],
    width: 6
  },
  
  // Increased tree density to match the visual of the image.
  landscape: { perimeter: ['N', 'W', 'S'], treeSpacing: 7 },
  structureLock: true,
  overrides: { warehouseMesh: '', officeMesh: '' }
};